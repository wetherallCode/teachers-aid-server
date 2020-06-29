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
    t.list.field('rubricWritingLevels', {
      type: WritingLevelEnum,
      required: true,
    })
    // t.field('rubricWritingLevel, {type: WritingLevelEnum, required: true})
    // t.list.field('linkedWritingLevels, {type: WritingLevelEnum, required: true})
  },
})

export const BuildRubricEntryPayload = objectType({
  name: 'BuildRubricEntryPayload',
  definition(t) {
    t.field('rubricEntry', { type: RubricEntry })
    // t.list.field('rubricEntries', { type: RubricEntry })
  },
})

export const BuildRubricEntry = mutationField('buildRubricEntry', {
  type: BuildRubricEntryPayload,
  args: { input: arg({ type: BuildRubricEntryInput, required: true }) },
  async resolve(
    _,
    { input: { entry, score, rubricSection, rubricWritingLevels } },
    { rubricData }
  ) {
    const rubricEntry: NexusGenRootTypes['RubricEntry'] = {
      entry,
      score,
      rubricSection,
      rubricWritingLevels,
    }
    const insertedId = await rubricData.insertOne(rubricEntry)
    rubricEntry._id = insertedId
    return { rubricEntry }
  },
})

// export const BuildRubricEntry = mutationField('buildRubricEntry', {
//   type: BuildRubricEntryPayload,
//   args: { input: arg({ type: BuildRubricEntryInput, required: true }) },
//   async resolve(
//     _,
//     { input: { entry, score, rubricSection, rubricWritingLevels } },
//     { rubricData }
//   ) {
//     const rubricEntries: NexusGenRootTypes['RubricEntry'][] = []
//     if (rubricWritingLevels.length > 0) {
//       for (const level of rubricWritingLevels) {
//         const rubricEntry: NexusGenRootTypes['RubricEntry'] = {
//           entry,
//           score,
//           rubricSection,
//           rubricWritingLevel: level,
//           linkedWritingLevels: rubricWritingLevels,
//         }
//         const insertedId = await rubricData.insertOne(rubricEntry)
//         rubricEntry._id = insertedId
//         rubricEntries.push(rubricEntry)
//       }
//       return { rubricEntries }
//     } else throw new Error('You need to include a list of writing levels')
//   },
// })
