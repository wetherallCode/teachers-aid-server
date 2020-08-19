import { objectType, inputObjectType, mutationField, arg } from '@nexus/schema'
import { hash } from 'argon2'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { Teacher, TitleEnum } from '..'

export const RegisterTeacherInput = inputObjectType({
  name: 'RegisterTeacherInput',
  definition(t) {
    t.string('email', { required: true })
    t.string('password', { required: true })
    t.string('userName', { required: true })
    t.string('firstName', { required: true })
    t.string('lastName', { required: true })
    t.field('title', {
      type: TitleEnum,
      required: true,
    })
  },
})

export const RegisterTeacherPayload = objectType({
  name: 'RegisterTeacherPayload',
  definition(t) {
    t.field('teacher', { type: Teacher })
  },
})

export const RegisterTeacher = mutationField('registerTeacher', {
  type: RegisterTeacherPayload,
  args: {
    input: arg({ type: RegisterTeacherInput, required: true }),
  },
  async resolve(
    _,
    { input: { userName, firstName, lastName, email, password, title } },
    { userData }
  ) {
    let existingUser = await userData.findOne({ userName })
    if (!existingUser) {
      const hashedPassword = await hash(password)

      let newTeacher: NexusGenRootTypes['Teacher'] = {
        email,
        password: hashedPassword,
        userName,
        firstName,
        lastName,
        title,
        teachesCourses: [],
      }
      const { insertedId } = await userData.insertOne(newTeacher)
      newTeacher._id = insertedId

      return { teacher: newTeacher }
    } else throw new Error(`${userName} already exists. Create a new username.`)
  },
})
