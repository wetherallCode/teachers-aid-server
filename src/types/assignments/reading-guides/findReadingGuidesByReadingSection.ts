import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ReadingGuide } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindReadingGuidesByReadingSectionInput = inputObjectType({
  name: 'FindReadingGuidesByReadingSectionInput',
  definition(t) {
    t.string('readingSections', { required: true })
  },
})

export const FindReadingGuidesByReadingSectionPayload = objectType({
  name: 'FindReadingGuidesByReadingSectionPayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const FindReadingGuidesByReadingSection = queryField(
  'findReadingGuidesByReadingSection',
  {
    type: FindReadingGuidesByReadingSectionPayload,
    args: {
      input: arg({
        type: FindReadingGuidesByReadingSectionInput,
        required: true,
      }),
    },
    async resolve(_, { input: { readingSections } }, { assignmentData }) {
      const readingGuides: NexusGenRootTypes['ReadingGuide'][] =
        await assignmentData
          .find({
            'readings.readingSections': readingSections,
            workingDraft: { $exists: false },
            quizzableSections: { $exists: false },
            textAnalysisCompletion: { $exists: false },
            completed: true,
          })
          .toArray()

      return { readingGuides }
    },
  },
)
