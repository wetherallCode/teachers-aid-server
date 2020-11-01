import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ResponsibilityPoints } from '..'

export const FindResponsibilityPointsByCourseInput = inputObjectType({
  name: 'FindResponsibilityPointsByCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindResponsibilityPointsByCoursePayload = objectType({
  name: 'FindResponsibilityPointsByCoursePayload',
  definition(t) {
    t.list.field('responsibilityPointList', { type: ResponsibilityPoints })
  },
})

export const FindResponsibilityPointsByCourse = queryField(
  'findResponsibilityPointsByCourse',
  {
    type: FindResponsibilityPointsByCoursePayload,
    args: {
      input: arg({
        type: FindResponsibilityPointsByCourseInput,
        required: true,
      }),
    },
    async resolve(_, { input: { courseId } }, { studentData }) {
      const responsibilityPointList = await studentData
        .find({
          'student.inCourses._id': new ObjectId(courseId),
          responsibilityPoints: { $exists: true },
        })
        .toArray()
      return { responsibilityPointList }
    },
  }
)
