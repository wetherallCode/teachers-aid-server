import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { MarkingPeriodEnum, ReadingGuide } from '../..'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindReadingGuidesByMarkingPeriodInput = inputObjectType({
  name: 'FindReadingGuidesByMarkingPeriodInput',
  definition(t) {
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const FindReadingGuidesByMarkingPeriodPayload = objectType({
  name: 'FindReadingGuidesByMarkingPeriodPayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const FindReadingGuidesByMarkingPeriod = queryField(
  'findReadingGuidesByMarkingPeriod',
  {
    type: FindReadingGuidesByMarkingPeriodPayload,
    args: {
      input: arg({
        type: FindReadingGuidesByMarkingPeriodInput,
        required: true,
      }),
    },
    async resolve(_, { input: { markingPeriod } }, { assignmentData }) {
      // console.log(new Date().toISOString().substring(17, 23))
      const readingGuides = await assignmentData
        .find({
          markingPeriod,
          workingDraft: { $exists: false },
          quizzableSections: { $exists: false },
          reviewed: false,
          completed: true,
        })
        .toArray()

      // console.log(new Date().toISOString().substring(17, 23))
      return { readingGuides }
    },
  }
)
