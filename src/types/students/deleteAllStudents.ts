import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllStudentsPayload = objectType({
  name: 'DeleteAllStudentsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllStudents = mutationField('deleteAllStudents', {
  type: DeleteAllStudentsPayload,
  async resolve(_, __, { userData, studentData }) {
    await userData.deleteMany({
      inCourses: { $exists: true },
    })
    await studentData.deleteMany({
      student: { $exists: true },
    })

    return { removed: true }
  },
})
