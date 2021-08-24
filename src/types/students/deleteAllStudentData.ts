import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllStudentDataPayload = objectType({
  name: 'DeleteAllStudentDataPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllStudentData = mutationField('deleteAllStudentData', {
  type: DeleteAllStudentDataPayload,
  async resolve(_, __, { studentData }) {
    const { deletedCount } = await studentData.deleteMany()
    console.log(deletedCount)
    // if (deletedCount === 1) {
    //   return { removed: true }
    // }
    return { removed: true }
  },
})
