import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { WritingLevelEnum } from '../../../students/progress-metrics/progressTracker'
import { RubricEntry } from '.'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'

export const FindRubricEntriesByCategoryInput = inputObjectType({
  name: 'FindRubricEntriesByCategoryInput',
  definition(t) {
    t.field('rubricWritingLevel', { type: WritingLevelEnum, required: true })
  },
})

export const FindRubricEntriesByCategoryPayload = objectType({
  name: 'FindRubricEntriesByCategoryPayload',
  definition(t) {
    t.list.field('rubricEntries', { type: RubricEntry })
  },
})

export const FindRubricEntriesByCategory = queryField(
  'findRubricEntriesByCategory',
  {
    type: FindRubricEntriesByCategoryPayload,
    args: {
      input: arg({ type: FindRubricEntriesByCategoryInput, required: true }),
    },
    async resolve(_, { input: { rubricWritingLevel } }, { rubricData }) {
      const rubricEntries: NexusGenRootTypes['RubricEntry'][] = await rubricData
        .find({ rubricWritingLevels: rubricWritingLevel })
        .toArray()

      return { rubricEntries }
    },
  }
)
