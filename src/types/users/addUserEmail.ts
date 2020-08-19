import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { User } from '.'
import { ObjectId } from 'mongodb'
import e = require('express')

export const AddUserEmailInput = inputObjectType({
  name: 'AddUserEmailInput',
  definition(t) {
    t.id('userId', { required: true })
    t.string('email')
  },
})

export const AddUserEmailPayload = objectType({
  name: 'AddUserEmailPayload',
  definition(t) {
    t.field('user', { type: User })
  },
})

export const AddUserEmail = mutationField('addUserEmail', {
  type: AddUserEmailPayload,
  args: { input: arg({ type: AddUserEmailInput, required: true }) },
  async resolve(_, { input: { userId, email } }, { userData }) {
    const userCheck = await userData.findOne({ _id: new ObjectId(userId) })
    if (userCheck) {
      await userData.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: { email },
        }
      )
      const user = await userData.findOne({ _id: new ObjectId(userId) })
      return { user }
    } else throw new Error('User does not exist.')
  },
})
