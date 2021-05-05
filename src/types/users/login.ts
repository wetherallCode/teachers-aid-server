import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { verify } from 'argon2'
import { User } from '.'

export const LoginInput = inputObjectType({
	name: 'LoginInput',
	definition(t) {
		t.string('userName', { required: true })
		t.string('password', { required: true })
	},
})

export const LoginPayload = objectType({
	name: 'LoginPayload',
	definition(t) {
		t.field('user', { type: User })
	},
})

export const login = mutationField('login', {
	type: LoginPayload,
	args: {
		input: arg({ type: LoginInput, required: true }),
	},
	async resolve(_, { input: { userName, password } }, { req, userData }) {
		const user = await userData.findOne({ userName })
		if (!user) {
			throw new Error('Wrong User Name')
		}

		const valid = await verify(user.password, password)
		// if (!valid) {
		//   throw new Error('Wrong Password')
		// }

		user.id = user._id.toString()
		req.session.userId = user.id
		console.log((req.session.userId = user.id))
		return { user: user }
	},
})
