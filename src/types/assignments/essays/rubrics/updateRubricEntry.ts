import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { RubricEntry, RubricSectionEnum } from '.'
import { WritingLevelEnum } from '../../../students/progress-metrics/writingMetrics'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const UpdateRubricEntryInput = inputObjectType({
  name: 'UpdateRubricEntryInput',
  definition(t) {
    t.id('rubricEntryId', { required: true })
    t.string('entry', { required: true })
    t.int('score', { required: true })
    t.field('rubricSection', { type: RubricSectionEnum, required: true })
    t.list.field('rubricWritingLevels', {
      type: WritingLevelEnum,
      required: true,
    })
  },
})

export const UpdateRubricEntryPayload = objectType({
  name: 'UpdateRubricEntryPayload',
  definition(t) {
    t.field('rubricEntry', { type: RubricEntry })
  },
})

export const UpdateRubricEntry = mutationField('updateRubricEntry', {
  type: UpdateRubricEntryPayload,
  args: { input: arg({ type: UpdateRubricEntryInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        rubricEntryId,
        entry,
        score,
        rubricSection,
        rubricWritingLevels,
      },
    },
    { rubricData }
  ) {
    const entryCheck: NexusGenRootTypes['RubricEntry'] = await rubricData.findOne(
      {
        _id: new ObjectId(rubricEntryId),
      }
    )

    if (entryCheck) {
      await rubricData.updateOne(
        { _id: new ObjectId(rubricEntryId) },
        {
          $set: {
            entry,
            score,
            rubricSection,
            rubricWritingLevels,
          },
        }
      )
    } else throw new Error('This Rubric Entry does not exist')

    const rubricEntry = await rubricData.findOne({
      _id: new ObjectId(rubricEntryId),
    })

    return { rubricEntry }
  },
})
