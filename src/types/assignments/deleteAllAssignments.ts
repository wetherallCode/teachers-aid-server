import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllAssignmentsPayload = objectType({
  name: 'DeleteAllAssignmentsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllAssignments = mutationField('deleteAllAssignments', {
  type: DeleteAllAssignmentsPayload,
  async resolve(_, __, { assignmentData }) {
    const { deletedCount } = await assignmentData.deleteMany()
    console.log(deletedCount)
    // if (deletedCount === 1) {
    //   return { removed: true }
    // }
    return { removed: true }
  },
})
