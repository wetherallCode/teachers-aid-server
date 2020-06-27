import { objectType, queryField } from '@nexus/schema'
import { RubricEntry } from '.'

export const FindRubricEntriesPayload = objectType({
  name: 'FindRubricEntriesPayload',
  definition(t) {
    t.list.field('rubricEntries', { type: RubricEntry })
  },
})

export const FindRubricEntries = queryField('findRubricEntries', {
  type: FindRubricEntriesPayload,
  async resolve(_, __, { rubricData }) {
    const rubricEntries = await rubricData
      .find({ rubricSection: { $exists: true } })
      .toArray()
    return { rubricEntries }
  },
})
