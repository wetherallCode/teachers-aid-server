import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TextAnalysis } from './textAnalysis'

export const FindTextAnalysesByCourseIdAndDueDateInput = inputObjectType({
  name: 'FindTextAnalysesByCourseIdAndDueDateInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('dueDate', { required: true })
  },
})

export const FindTextAnalysesByCourseIdAndDueDatePayload = objectType({
  name: 'FindTextAnalysesByCourseIdAndDueDatePayload',
  definition(t) {
    t.list.field('textAnalyses', { type: TextAnalysis })
  },
})

export const FindTextAnalysesByCourseIdAndDueDate = queryField(
  'findTextAnalysesByCourseIdAndDueDate',
  {
    type: FindTextAnalysesByCourseIdAndDueDatePayload,
    args: {
      input: arg({
        type: FindTextAnalysesByCourseIdAndDueDateInput,
        required: true,
      }),
    },
    async resolve(_, { input: { courseId, dueDate } }, { assignmentData }) {
      const textAnalyses = await assignmentData
        .find({ 'hasOwner.inCourses': new ObjectId(courseId), dueDate })
        .toArray()

      return { textAnalyses }
    },
  }
)
