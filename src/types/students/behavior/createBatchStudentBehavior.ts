import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { MarkingPeriodEnum } from '../../general'
import { StudentBehavior } from './studentBehavior'

export const CreateBatchStudentBehaviorInput = inputObjectType({
  name: 'CreateBatchStudentBehaviorInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.string('behaviorTypeId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.float('responsibilityPoints', { required: true })
  },
})

export const CreateBatchStudentBehaviorPayload = objectType({
  name: 'CreateBatchStudentBehaviorPayload',
  definition(t) {
    t.list.field('studentBehaviors', { type: StudentBehavior })
  },
})

export const CreateBatchStudentBehavior = mutationField(
  'createBatchStudentBehavior',
  {
    type: CreateBatchStudentBehaviorPayload,
    args: {
      input: arg({ type: CreateBatchStudentBehaviorInput, required: true }),
    },
    async resolve(
      _,
      {
        input: {
          studentIds,
          behaviorTypeId,
          markingPeriod,
          responsibilityPoints,
        },
      },
      { studentData, userData, behaviorData }
    ) {
      const studentBehaviors: NexusGenRootTypes['StudentBehavior'][] = []

      for (const studentId of studentIds) {
        const behavior = await behaviorData.findOne({
          _id: new ObjectId(behaviorTypeId),
        })

        if (behavior) {
          const studentCheck: NexusGenRootTypes['Student'] =
            await userData.findOne({
              _id: new ObjectId(studentId),
            })
          const studentBehavior: NexusGenRootTypes['StudentBehavior'] = {
            behavior,
            date: new Date().toLocaleDateString(),
            student: studentCheck,
            responsibilityPoints,
            markingPeriod,
          }
          const { insertedId } = await studentData.insertOne(studentBehavior)
          studentBehavior._id = insertedId
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
          studentBehaviors.push(studentBehavior)
        }
      }

      return { studentBehaviors }
    },
  }
)
