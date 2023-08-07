import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const ModifyAssignmentsInput = inputObjectType({
//   name: 'ModifyAssignmentsInput',
//   definition(t) {
//     t.string('dateAssigned', { required: true })
//     // t.string('oldAssignedDate', { required: true })
//     t.string('newAssignedDate', { required: true })
//     // t.string('oldDueDate', { required: true })
//     t.string('newDueDate', { required: true })
//   },
// })

export const ModifyAssignmentsPayload = objectType({
  name: 'ModifyAssignmentsPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyAssignments = mutationField('modifyAssignments', {
  type: ModifyAssignmentsPayload,
  // args: { input: arg({ type: ModifyAssignmentsInput, required: true }) },
  async resolve(
    _,
    __,
    // { input: { dateAssigned, newAssignedDate, newDueDate } },
    { assignmentData }
  ) {
    const { modifiedCount } = assignmentData.updateMany(
      { workingDraft: { $exists: true }, assignedDate: '11/22/2022' },
      // {
      //   assignedDate: dateAssigned,
      //   workingDraft: { $exists: true },
      // },
      { $set: { dueDate: '11/28/2022' } }
    )

    return { modified: true }
  },
})
