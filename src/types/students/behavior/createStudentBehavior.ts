import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { BehaviorEnum, StudentBehavior } from '.'
import { ObjectID, ObjectId } from 'mongodb'
import { MarkingPeriodEnum } from '../..'

export const CreateStudentBehaviorInput = inputObjectType({
  name: 'CreateStudentBehaviorInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('behaviorTypeId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.float('responsibilityPoints', { required: true })
    t.string('date', { required: true })
  },
})

export const CreateStudentBehaviorPayload = objectType({
  name: 'CreateStudentBehaviorPayload',
  definition(t) {
    t.field('studentBehavior', { type: StudentBehavior })
  },
})

export const CreateStudentBehavior = mutationField('createStudentBehavior', {
  type: CreateStudentBehaviorPayload,
  args: { input: arg({ type: CreateStudentBehaviorInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        studentId,
        behaviorTypeId,
        markingPeriod,
        responsibilityPoints,
        date,
      },
    },
    { studentData, userData, behaviorData }
  ) {
    const studentCheck: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: new ObjectId(studentId),
    })

    if (studentCheck) {
      const behavior: NexusGenRootTypes['BehaviorType'] =
        await behaviorData.findOne({
          _id: new ObjectId(behaviorTypeId),
        })!
      if (behavior) {
        const studentBehavior: NexusGenRootTypes['StudentBehavior'] = {
          behavior,
          date,
          student: studentCheck,
          responsibilityPoints,
          markingPeriod,
        }
        const { insertedId } = await studentData.insertOne(studentBehavior)
        studentBehavior._id = insertedId

        if (false) {
        }

        if (
          //if student is unprepared
          new ObjectId(behavior._id!).toHexString() ===
          new ObjectId('62a1f1152c8c161570b3c256').toHexString()
        ) {
          const preparedCheck: NexusGenRootTypes['StudentBehavior'] =
            await studentData.findOne({
              date,
              'student._id': new ObjectId(studentCheck._id!),
              'behavior._id': new ObjectId('62a33f0c2c8c161570b3c258'),
            })
          await studentData.deleteOne({ _id: new ObjectId(preparedCheck._id!) })
        }

        if (
          //undo unprepared and replace it with Prepared and Ready
          new ObjectId(behavior._id!).toHexString() ===
          new ObjectId('62a33f0c2c8c161570b3c258').toHexString()
        ) {
          const unPreparedCheck: NexusGenRootTypes['StudentBehavior'] =
            await studentData.findOne({
              date,
              'student._id': new ObjectId(studentCheck._id!),
              'behavior._id': new ObjectId('62a1f1152c8c161570b3c256'),
            })
          await studentData.deleteOne({
            _id: new ObjectId(unPreparedCheck._id!),
          })
          await studentData.updateOne(
            {
              'student._id': new ObjectId(studentId),
              markingPeriod: markingPeriod,
              responsibilityPoints: { $exists: true },
            },
            {
              $inc: {
                responsibilityPoints: 2,
              },
            }
          )
        }
        await studentData.updateOne(
          {
            'student._id': new ObjectId(studentId),
            markingPeriod: markingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: {
              responsibilityPoints,
            },
          }
        )
        return { studentBehavior }
      } else throw new Error('Behavior does not exist.')
    } else throw new Error('Student does not exist.')
  },
})
