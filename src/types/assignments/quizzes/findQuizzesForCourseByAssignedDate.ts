import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Quiz } from '.'

export const FindQuizzesForCourseByAssignedDateInput = inputObjectType({
  name: 'FindQuizzesForCourseByAssignedDateInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('assignedDate', { required: true })
  },
})

export const FindQuizzesForCourseByAssignedDatePayload = objectType({
  name: 'FindQuizzesForCourseByAssignedDatePayload',
  definition(t) {
    t.list.field('quizzes', { type: Quiz })
  },
})

export const FindQuizzesForCourseByAssignedDate = queryField(
  'findQuizzesForCourseByAssignedDate',
  {
    type: FindQuizzesForCourseByAssignedDatePayload,
    args: {
      input: arg({
        type: FindQuizzesForCourseByAssignedDateInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { courseId, assignedDate } },
      { assignmentData }
    ) {
      const quizzes = await assignmentData
        .find({
          quizzableSections: { $exists: true },
          'hasOwner.inCourses._id': new ObjectId(courseId),
          assignedDate,
        })
        .toArray()
      return { quizzes }
    },
  }
)
