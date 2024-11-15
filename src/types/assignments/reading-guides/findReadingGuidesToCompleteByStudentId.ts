import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuide } from '.'

export const FindReadingGuidesToCompleteByStudentIdInput = inputObjectType({
  name: 'FindReadingGuidesToCompleteByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindReadingGuidesToCompleteByStudentIdPayload = objectType({
  name: 'FindReadingGuidesToCompleteByStudentIdPayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const FindReadingGuidesToCompleteByStudentId = queryField(
  'findReadingGuidesToCompleteByStudentId',
  {
    type: FindReadingGuidesToCompleteByStudentIdPayload,
    args: {
      input: arg({
        type: FindReadingGuidesToCompleteByStudentIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId } }, { assignmentData }) {
      const readingGuides = await assignmentData
        .find({
          'hasOwner._id': new ObjectId(studentId),
          // assigned: true,
          articleTitle: { $exists: false },
          workingDraft: { $exists: false },
          quizzableSections: { $exists: false },
          textAnalysisCompletion: { $exists: false },
        })
        .toArray()
      return { readingGuides }
    },
  },
)
