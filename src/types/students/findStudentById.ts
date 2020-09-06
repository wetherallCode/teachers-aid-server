import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Student } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const FindStudentByIdInput = inputObjectType({
  name: 'FindStudentByIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindStudentByIdPayload = objectType({
  name: 'FindStudentByIdPayload',
  definition(t) {
    t.field('student', { type: Student })
  },
})

export const FindStudentById = queryField('findStudentById', {
  type: FindStudentByIdPayload,
  args: { input: arg({ type: FindStudentByIdInput, required: true }) },
  async resolve(_, { input: { studentId } }, { userData, protocolData }) {
    const student = await userData.findOne({
      _id: new ObjectId(studentId),
      inCourses: { $exists: true },
    })
    const studentInfo: any = await protocolData.findOne({
      'student._id': new ObjectId(student._id),
    })

    return { student }
  },
})
