import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { RubricEntry, RubricSectionEnum } from './rubricEntry'
import { WritingLevelEnum } from '../../../students/progress-metrics/writingMetrics'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'

export const BuildRubricEntryInput = inputObjectType({
  name: 'BuildRubricEntryInput',
  definition(t) {
    t.string('entry', { required: true })
    t.int('score', { required: true })
    t.field('rubricSection', { type: RubricSectionEnum, required: true })
    t.list.field('rubricCategories', { type: WritingLevelEnum, required: true })
  },
})

export const BuildRubricEntryPayload = objectType({
  name: 'BuildRubricEntryPayload',
  definition(t) {
    t.field('rubricEntry', { type: RubricEntry })
  },
})

export const BuildRubricEntry = mutationField('buildRubricEntry', {
  type: BuildRubricEntryPayload,
  args: { input: arg({ type: BuildRubricEntryInput, required: true }) },
  async resolve(
    _,
    { input: { entry, score, rubricSection, rubricCategories } },
    { rubricData }
  ) {
    const rubricEntry: NexusGenRootTypes['RubricEntry'] = {
      entry,
      score,
      rubricSection,
      rubricCategories,
    }
    const insertedId = await rubricData.insertOne(rubricEntry)
    rubricEntry._id = insertedId
    return { rubricEntry }
  },
})
