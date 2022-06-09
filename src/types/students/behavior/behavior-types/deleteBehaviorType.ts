import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const DeleteBehaviorTypeInput = inputObjectType({
  name: 'DeleteBehaviorTypeInput',
  definition(t) {
    t.id('behaviorTypeId', { required: true })
  },
})

export const DeleteBehaviorTypePayload = objectType({
  name: 'DeleteBehaviorTypePayload',
  definition(t) {
    t.boolean('deleted')
  },
})

export const DeleteBehaviorType = mutationField('deleteBehaviorType', {
  type: DeleteBehaviorTypePayload,
  args: { input: arg({ type: DeleteBehaviorTypeInput, required: true }) },
  async resolve(_, { input: { behaviorTypeId } }, { behaviorData }) {
    const behaviorTypeValid = await behaviorData.findOne({
      _id: new ObjectId(behaviorTypeId),
    })
    if (behaviorTypeValid) {
      const { deletedCount } = await behaviorData.deleteOne({
        _id: new ObjectId(behaviorTypeId),
      })
      return { deleted: deletedCount === 1 ? true : false }
    } else throw new Error('Behavior Type does not exist.')
  },
})
