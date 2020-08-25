import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { User } from '.'
import { verify, hash } from 'argon2'

export const ChangePasswordInput = inputObjectType({
  name: 'ChangePasswordInput',
  definition(t) {
    t.string('userName', { required: true })
    t.string('oldPassword', { required: true })
    t.string('newPassword', { required: true })
  },
})

export const ChangePasswordPayload = objectType({
  name: 'ChangePasswordPayload',
  definition(t) {
    t.field('user', { type: User })
  },
})

export const ChangePassword = mutationField('changePassword', {
  type: ChangePasswordPayload,
  args: { input: arg({ type: ChangePasswordInput, required: true }) },
  async resolve(
    _,
    { input: { userName, oldPassword, newPassword } },
    { userData }
  ) {
    const userCheck = await userData.findOne({ userName })
    const hashedPassword = await hash(newPassword)

    if (!userCheck) {
      throw new Error('Wrong User Name')
    }

    const valid = await verify(userCheck.password, oldPassword)

    if (!valid) {
      throw new Error('Wrong Password')
    } else {
      userData.updateOne(
        { userName },
        {
          $set: {
            password: hashedPassword,
          },
        }
      )
    }
    const user = await userData.findOne({ userName })
    return { user }
  },
})
