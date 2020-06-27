import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const RemoveRubricEntryInput = inputObjectType({
  name: 'RemoveRubricEntryInput',
  definition(t) {
    t.id('rubricEntryId', { required: true })
  },
})

export const RemoveRubricEntryPayload = objectType({
  name: 'RemoveRubricEntryPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveRubricEntry = mutationField('removeRubricEntry', {
  type: RemoveRubricEntryPayload,
  args: { input: arg({ type: RemoveRubricEntryInput, required: true }) },
  async resolve(_, { input: { rubricEntryId } }, { rubricData }) {
    const rubricEntry = await rubricData.findOne({
      _id: new ObjectId(rubricEntryId),
    })
    if (rubricEntry) {
      const { deletedCount } = await rubricData.deleteOne({
        _id: new ObjectId(rubricEntryId),
      })
      if (deletedCount === 1) {
        return { removed: true }
      } else throw new Error('Something went wrong')
    } else throw new Error('RubricEntry was not removed')
  },
})
