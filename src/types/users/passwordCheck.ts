import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { verify } from 'argon2'

export const PasswordCheckInput = inputObjectType({
  name: 'PasswordCheckInput',
  definition(t) {
    t.string('password', { required: true })
  },
})

export const PasswordCheckPayload = objectType({
  name: 'PasswordCheckPayload',
  definition(t) {
    t.boolean('firstTimeLoginIn')
  },
})

export const PasswordCheck = queryField('passwordCheck', {
  type: PasswordCheckPayload,
  args: { input: arg({ type: PasswordCheckInput, required: true }) },
  async resolve(_, { input: { password } }, ___) {
    const valid = await verify(password, 'password')
    return { firstTimeLoginIn: valid }
  },
})
