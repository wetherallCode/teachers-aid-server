import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ModifyAssignmentsInput = inputObjectType({
  name: 'ModifyAssignmentsInput',
  definition(t) {
    t.string('dateAssigned', { required: true })
    // t.string('oldAssignedDate', { required: true })
    t.string('newAssignedDate', { required: true })
    // t.string('oldDueDate', { required: true })
    t.string('newDueDate', { required: true })
  },
})

export const ModifyAssignmentsPayload = objectType({
  name: 'ModifyAssignmentsPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyAssignments = mutationField('modifyAssignments', {
  type: ModifyAssignmentsPayload,
  args: { input: arg({ type: ModifyAssignmentsInput, required: true }) },
  async resolve(
    _,
    { input: { dateAssigned, newAssignedDate, newDueDate } },
    { assignmentData }
  ) {
    const { modifiedCount } = assignmentData.updateMany(
      {
        assignedDate: dateAssigned,
        workingDraft: { $exists: true },
      },
      { $set: { assignedDate: newAssignedDate, dueDate: newDueDate } }
    )

    return { modified: true }
  },
})
