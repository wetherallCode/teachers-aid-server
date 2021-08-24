import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllStudentsPayload = objectType({
  name: 'DeleteAllStudentsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllStudents = mutationField('deleteAllStudents', {
  type: DeleteAllStudentsPayload,
  async resolve(_, __, { userData }) {
    const { deletedCount } = await userData.deleteMany({
      inCourses: { $exists: true },
    })
    console.log(deletedCount)
    // if (deletedCount === 1) {
    //   return { removed: true }
    // }
    return { removed: true }
  },
})
