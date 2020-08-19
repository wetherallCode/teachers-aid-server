import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Student } from '.'

export const FindAllStudentsPayload = objectType({
  name: 'FindAllStudentsPayload',
  definition(t) {
    t.list.field('students', { type: Student })
  },
})

export const FindAllStudents = queryField('findAllStudents', {
  type: FindAllStudentsPayload,
  async resolve(_, __, { userData }) {
    return {
      students: await userData.find({ inCourses: { $exists: true } }).toArray(),
    }
  },
})
