import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const UpdateUserActiveInput = inputObjectType({
  name: 'UpdateUserActiveInput',
  definition(t) {
    t.id('userId', { required: true })
    t.boolean('isActive', { required: true })
  },
})

export const UpdateUserActivePayload = objectType({
  name: 'UpdateUserActivePayload',
  definition(t) {
    t.boolean('updated')
  },
})

export const UpdateUserActive = mutationField('updateUserActive', {
  type: UpdateUserActivePayload,
  args: { input: arg({ type: UpdateUserActiveInput, required: true }) },
  async resolve(_, { input: { userId, isActive } }, { userData }) {
    const user = await userData.findOne({ _id: new ObjectId(userId) })

    if (user) {
      const { modifiedCount } = await userData.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { isActive } }
      )
      return { updated: modifiedCount === 1 ? true : false }
    } else throw new Error('User is not verified!')
  },
})
