import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TextAnalysis } from './textAnalysis'

export const FindTextAnalysisByStudentIdAndDueDateInput = inputObjectType({
  name: 'FindTextAnalysisByStudentIdAndDueDateInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('dueDate', { required: true })
  },
})

export const FindTextAnalysisByStudentIdAndDueDatePayload = objectType({
  name: 'FindTextAnalysisByStudentIdAndDueDatePayload',
  definition(t) {
    t.field('textAnalysis', { type: TextAnalysis })
  },
})

export const FindTextAnalysisByStudentIdAndDueDate = queryField(
  'findTextAnalysisByStudentIdAndDueDate',
  {
    type: FindTextAnalysisByStudentIdAndDueDatePayload,
    args: {
      input: arg({
        type: FindTextAnalysisByStudentIdAndDueDateInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId, dueDate } }, { assignmentData }) {
      const textAnalysis = await assignmentData.findOne({
        'hasOwner._id': new ObjectId(studentId),
        dueDate,
      })
      return { textAnalysis }
    },
  }
)
