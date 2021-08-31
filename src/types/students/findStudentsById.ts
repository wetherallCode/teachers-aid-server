import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Student } from './student'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const FindStudentsByIdInput = inputObjectType({
  name: 'FindStudentsByIdInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
  },
})

export const FindStudentsByIdPayload = objectType({
  name: 'FindStudentsByIdPayload',
  definition(t) {
    t.list.field('students', { type: Student })
  },
})

export const FindStudentsById = queryField('findStudentsById', {
  type: FindStudentsByIdPayload,
  args: { input: arg({ type: FindStudentsByIdInput, required: true }) },
  async resolve(_, { input: { studentIds } }, { userData }) {
    const students: NexusGenRootTypes['Student'][] = []
    for (const _id of studentIds) {
      const student = await userData.findOne({ _id: new ObjectId(_id) })
      students.push(student)
    }

    return { students }
  },
})
