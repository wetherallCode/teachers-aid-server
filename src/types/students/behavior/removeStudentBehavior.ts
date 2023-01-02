import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { MarkingPeriodEnum } from '../..'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const RemoveStudentBehaviorInput = inputObjectType({
  name: 'RemoveStudentBehaviorInput',
  definition(t) {
    t.id('studentBehaviorId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const RemoveStudentBehaviorPayload = objectType({
  name: 'RemoveStudentBehaviorPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveStudentBehavior = mutationField('removeStudentBehavior', {
  type: RemoveStudentBehaviorPayload,
  args: { input: arg({ type: RemoveStudentBehaviorInput, required: true }) },
  async resolve(
    _,
    { input: { studentBehaviorId, markingPeriod } },
    { studentData }
  ) {
    const behaviorCheck: NexusGenRootTypes['StudentBehavior'] =
      await studentData.findOne({ _id: new ObjectId(studentBehaviorId) })

    const responsiblityPointRestore = (responsibilityPoints: number) => {
      if (responsibilityPoints < 0) {
        return responsibilityPoints * -1
      }
      if (responsibilityPoints > 0) {
        return -responsibilityPoints
      } else return 0
    }
    const responsibility = responsiblityPointRestore(
      behaviorCheck.responsibilityPoints
    )

    if (behaviorCheck) {
      const { deletedCount } = await studentData.deleteOne({
        _id: new ObjectId(studentBehaviorId),
      })

      if (deletedCount === 1) {
        const { modifiedCount } = await studentData.updateOne(
          {
            'student._id': new ObjectId(behaviorCheck.student._id!),
            markingPeriod: markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          {
            $inc: {
              responsibilityPoints: responsibility,
            },
          }
        )

        return { removed: true }
      }
      throw new Error('Something went wrong')
    } else throw new Error('Absence does not exist!')
  },
})
