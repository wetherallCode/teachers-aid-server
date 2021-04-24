import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const GradeTemporaryTaskInput = inputObjectType({
  name: 'GradeTemporaryTaskInput',
  definition(t) {
    t.id('_id', { required: true })
    t.boolean('answered', { required: true })
    t.boolean('studentPresent', { required: true })
    t.float('responsibilityPoints', { required: true })
    t.float('lastGrade', { required: true })
  },
})

export const GradeTemporaryTaskPayload = objectType({
  name: 'GradeTemporaryTaskPayload',
  definition(t) {
    t.field('temporaryTask', { type: TemporaryTask })
  },
})

export const GradeTemporaryTask = mutationField('gradeTemporaryTask', {
  type: GradeTemporaryTaskPayload,
  args: { input: arg({ type: GradeTemporaryTaskInput, required: true }) },
  async resolve(
    _,
    {
      input: { _id, answered, studentPresent, responsibilityPoints, lastGrade },
    },
    { temporaryTaskData, generalData, studentData }
  ) {
    const temporaryTaskCheck: NexusGenRootTypes['TemporaryTask'] = await temporaryTaskData.findOne(
      {
        _id: new ObjectId(_id),
      }
    )
    responsibilityPoints
    const mp = await generalData.findOne({
      currentMarkingPeriod: { $exists: true },
    })

    if (temporaryTaskCheck) {
      const studentId = temporaryTaskCheck.student._id!
      await temporaryTaskData.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            answered,
            studentPresent,
          },
        }
      )
      // if already earned points for answering but mistake was made
      if (temporaryTaskCheck.answered && !answered) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(studentId!),
            markingPeriod: mp.currentMarkingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: { responsibilityPoints: -lastGrade },
            $set: { lastGrade: 0 },
          }
        )
      }

      //   if student hasn't already answered this task then they will get 2 responsibility points if they answer
      if (!temporaryTaskCheck.answered && answered) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(studentId!),
            markingPeriod: mp.currentMarkingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $set: { lastGrade: responsibilityPoints },
            $inc: { responsibilityPoints: responsibilityPoints },
          }
        )
      }

      const temporaryTask = await temporaryTaskData.findOne({
        _id: new ObjectId(_id),
      })
      return { temporaryTask }
    } else throw new Error('Task not created')
  },
})
