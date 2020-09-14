import { arg, inputObjectType, mutationField, objectType } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { User } from '.'
import { verify, hash } from 'argon2'

export const ResetPasswordInput = inputObjectType({
  name: 'ResetPasswordInput',
  definition(t) {
    t.string('userId', { required: true })
  },
})

export const ResetPasswordPayload = objectType({
  name: 'ResetPasswordPayload',
  definition(t) {
    t.field('user', { type: User })
  },
})

export const ResetPassword = mutationField('resetPassword', {
  type: ResetPasswordPayload,
  args: { input: arg({ type: ResetPasswordInput, required: true }) },
  async resolve(_, { input: { userId } }, { userData }) {
    const userCheck = await userData.findOne({ _id: new ObjectId(userId) })
    const hashedPassword = await hash('password')
    if (userCheck) {
      userData.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            password: hashedPassword,
          },
        }
      )
      const user = await userData.findOne({ _id: new ObjectId(userId) })
      return { user }
    } else throw new Error('User does not exist')
  },
})
