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
      const { deletedCount } = await studentData.deleteOne({
        _id: new ObjectId(_id),
      })
      if (deletedCount === 1) {
        return { removed: true }
      }
      throw new Error('Something went wrong')
    } else throw new Error('Lateness does not exist!')
  },
})
