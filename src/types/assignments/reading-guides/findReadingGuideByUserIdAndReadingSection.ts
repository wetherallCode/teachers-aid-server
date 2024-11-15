import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuide } from '.'

export const FindReadingGuideByUserIdAndReadingSectionInput = inputObjectType({
  name: 'FindReadingGuideByUserIdAndReadingSectionInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('readingSections', { required: true })
  },
})

export const FindReadingGuideByUserIdAndReadingSectionPayload = objectType({
  name: 'FindReadingGuideByUserIdAndReadingSectionPayload',
  definition(t) {
    t.field('readingGuide', { type: ReadingGuide, nullable: true })
  },
})

export const FindReadingGuideByUserIdAndReadingSection = queryField(
  'findReadingGuideByUserIdAndReadingSection',
  {
    type: FindReadingGuideByUserIdAndReadingSectionPayload,
    args: {
      input: arg({
        type: FindReadingGuideByUserIdAndReadingSectionInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { studentId, readingSections } },
      { assignmentData },
    ) {
      const readingGuide = await assignmentData.findOne({
        'hasOwner._id': new ObjectId(studentId),
        'readings.readingSections': readingSections,
        quizzableSections: { $exists: false },
        textAnalysisCompletion: { $exists: false },
        workingDraft: { $exists: false },
      })

      return { readingGuide }
    },
  },
)
