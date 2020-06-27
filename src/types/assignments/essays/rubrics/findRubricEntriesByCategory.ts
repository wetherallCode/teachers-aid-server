import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { WritingLevelEnum } from '../../../students/progress-metrics/writingMetrics'
import { RubricEntry } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const FindRubricEntriesByCategoryInput = inputObjectType({
  name: 'FindRubricEntriesByCategoryInput',
  definition(t) {
    t.field('rubricCategory', { type: WritingLevelEnum, required: true })
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
    async resolve(_, { input: { rubricCategory } }, { rubricData }) {
      const rubricEntries: NexusGenRootTypes['RubricEntry'][] = await rubricData
        .find({ rubricCategories: rubricCategory })
        .toArray()

      return { rubricEntries }
    },
  }
)