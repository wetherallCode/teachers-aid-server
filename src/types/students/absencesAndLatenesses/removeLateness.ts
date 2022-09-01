import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const RemoveLatenessInput = inputObjectType({
  name: 'RemoveLatenessInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const RemoveLatenessPayload = objectType({
  name: 'RemoveLatenessPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveLateness = mutationField('removeLateness', {
  type: RemoveLatenessPayload,
  args: { input: arg({ type: RemoveLatenessInput, required: true }) },
  async resolve(
    _,
    { input: { _id } },
    { studentData, lessonData, behaviorData }
  ) {
    const lateness: NexusGenRootTypes['StudentLateness'] =
      await studentData.findOne({
        _id: new ObjectId(_id),
      })

    const lessonStartedCheck: NexusGenRootTypes['Lesson'] =
      await lessonData.findOne({
        assignedDate: lateness.dayLate,
        assignedCourses: lateness.student.inCourses[0],
      })
    const readyForClassCheck = await studentData.findOne({
      'student._id': new ObjectId(lateness.student._id!),
      date: lateness.dayLate,
    })

    if (lateness) {
      const { deletedCount } = await studentData.deleteOne({
        _id: new ObjectId(_id),
      })
      if (deletedCount === 1) {
        if (lessonStartedCheck) {
          if (lateness.latenessType === 'UNEXCUSED') {
            studentData.updateOne(
              {
                'student._id': new ObjectId(lateness.student._id!),
                markingPeriod: lateness.markingPeriod,
                responsibilityPoints: { $exists: true },
              },
              {
                $inc: {
                  responsibilityPoints: 5,
                },
              }
            )
          }
        }
        if (lessonStartedCheck.lessonStarted && !readyForClassCheck) {
          const behavior = await behaviorData.findOne({
            _id: new ObjectId('62a33f0c2c8c161570b3c258'),
          })
          const studentBehavior: NexusGenRootTypes['StudentBehavior'] = {
            behavior: behavior,
            date: new Date().toLocaleDateString(),
            student: lateness.student,
            responsibilityPoints: 2,
            markingPeriod: lateness.markingPeriod,
          }
          const { insertedId } = await studentData.insertOne(studentBehavior)
          studentBehavior._id = insertedId

          await studentData.updateOne(
            {
              'student._id': new ObjectId(lateness.student._id!),
              markingPeriod: lateness.markingPeriod,
              responsibilityPoints: { $exists: true },
            },
            {
              $inc: {
                responsibilityPoints: 2,
              },
            }
          )
        }
        return { removed: true }
      }
      throw new Error('Something went wrong')
    } else throw new Error('Lateness does not exist!')
  },
})
