import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { User } from '.'
import { ObjectId } from 'mongodb'

export const FindUserDataInput = inputObjectType({
  name: 'FindUserDataInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const FindUserDataPayload = objectType({
  name: 'FindUserDataPayload',
  definition(t) {
    t.field('user', { type: User })
  },
})

export const FindUserData = queryField('findUserData', {
  type: FindUserDataPayload,
  args: { input: arg({ type: FindUserDataInput, required: true }) },
  async resolve(_, { input: { _id } }, { userData }) {
    const user = await userData.findOne({ _id: new ObjectId(_id) })
    return { user }
  },
})
