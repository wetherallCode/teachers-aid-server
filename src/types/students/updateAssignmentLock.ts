import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const UpdateAssignmentLockInput = inputObjectType({
  name: 'UpdateAssignmentLockInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const UpdateAssignmentLockPayload = objectType({
  name: 'UpdateAssignmentLockPayload',
  definition(t) {
    t.boolean('updated')
  },
})

export const UpdateAssignmentLock = mutationField('updateAssignmentLock', {
  type: UpdateAssignmentLockPayload,
  args: { input: arg({ type: UpdateAssignmentLockInput, required: true }) },
  async resolve(_, { input: { studentId } }, { userData }) {
    const student = await userData.findOne({ _id: new ObjectId(studentId) })

    const { modifiedCount } = await userData.updateOne(
      {
        _id: new ObjectId(studentId),
      },
      { $set: { assignmentLock: !student.assignmentLock } },
    )
    return { updated: modifiedCount === 1 }
  },
})
