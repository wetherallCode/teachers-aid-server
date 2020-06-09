import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const RemoveLatenessInput = inputObjectType({
  name: 'RemoveLatenessInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const RemoveLatenessPayload = objectType({
  name: 'RemoveLatenessPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveLateness = mutationField('removeLateness', {
  type: RemoveLatenessPayload,
  args: { input: arg({ type: RemoveLatenessInput, required: true }) },
  async resolve(_, { input: { _id } }, { studentData }) {
    const lateness = await studentData.findOne({ _id: new ObjectId(_id) })

    if (lateness) {
      const returnedValue = await studentData.deleteOne({
        _id: new ObjectId(_id),
      })
      return { removed: returnedValue.deletedCount > 0 }
    } else return { removed: false }
  },
})
