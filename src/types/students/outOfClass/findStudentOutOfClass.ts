import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { StudentOutOfClass } from './studentOutOfClass'

export const FindStudentOutOfClassInput = inputObjectType({
  name: 'FindStudentOutOfClassInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('date', { required: true })
  },
})

export const FindStudentOutOfClassPayload = objectType({
  name: 'FindStudentOutOfClassPayload',
  definition(t) {
    t.list.field('studentOutOfClass', { type: StudentOutOfClass })
  },
})

export const FindStudentOutOfClass = queryField('findStudentOutOfClass', {
  type: FindStudentOutOfClassPayload,
  args: { input: arg({ type: FindStudentOutOfClassInput, required: true }) },
  async resolve(_, { input: { studentId, date } }, { studentData }) {
    const studentOutOfClass: NexusGenRootTypes['StudentOutOfClass'][] =
      await studentData
        .findMany({
          'student._id': new Object(studentId),
          outOfClassDestination: { $exists: true },
          date,
        })
        .toArray()
    return { studentOutOfClass }
  },
})
