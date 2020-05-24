import { objectType, mutationField, arg, inputObjectType } from '@nexus/schema'
import { hash } from 'argon2'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { Student } from '.'

export const RegisterStudentInput = inputObjectType({
  name: 'RegisterStudentInput',
  definition(t) {
    t.string('email', { required: true })
    t.string('password', { required: true })
    t.string('userName', { required: true })
    t.string('firstName', { required: true })
    t.string('lastName', { required: true })
  },
})

export const RegisterStudentPayload = objectType({
  name: 'RegisterStudentPayload',
  definition(t) {
    t.field('student', { type: Student })
  },
})

export const RegisterStudent = mutationField('registerStudent', {
  type: RegisterStudentPayload,
  args: {
    input: arg({ type: RegisterStudentInput, required: true }),
  },
  async resolve(
    _,
    { input: { userName, firstName, lastName, email, password } },
    { userData }
  ) {
    let existingUser = await userData.findOne({ userName })
    if (!existingUser) {
      const hashedPassword = await hash(password)

      let newStudent: NexusGenRootTypes['Student'] = {
        email,
        password: hashedPassword,
        userName,
        firstName,
        lastName,
        inCourses: [],
      }
      const { insertedId } = await userData.insertOne(newStudent)
      newStudent._id = insertedId

      return { student: newStudent }
    } else throw new Error(`${userName} already exists. Create a new username.`)
  },
})
