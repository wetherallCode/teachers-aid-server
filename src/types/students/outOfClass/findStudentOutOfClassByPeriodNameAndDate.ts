import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { StudentOutOfClass } from './studentOutOfClass'

export const FindStudentOutOfClassByPeriodNameAndDateInput = inputObjectType({
  name: 'FindStudentOutOfClassByPeriodNameAndDateInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('date', { required: true })
  },
})

export const FindStudentOutOfClassByPeriodNameAndDatePayload = objectType({
  name: 'FindStudentOutOfClassByPeriodNameAndDatePayload',
  definition(t) {
    t.list.field('studentsOutOfClass', { type: StudentOutOfClass })
  },
})

export const FindStudentOutOfClassByPeriodNameAndDate = queryField(
  'findStudentOutOfClassByPeriodNameAndDate',
  {
    type: FindStudentOutOfClassByPeriodNameAndDatePayload,
    args: {
      input: arg({
        type: FindStudentOutOfClassByPeriodNameAndDateInput,
        required: true,
      }),
    },
    async resolve(_, { input: { courseId, date } }, { studentData }) {
      const findStudentsOutOfClass = await studentData
        .find({
          'student.inCourses._id': new ObjectId(courseId),
          date,
          outOfClassDestination: { $exists: true },
        })
        .toArray()
      return { studentsOutOfClass: findStudentsOutOfClass }
    },
  }
)
