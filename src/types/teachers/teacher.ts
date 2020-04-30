import {
  objectType,
  inputObjectType,
  mutationField,
  arg,
  enumType,
} from '@nexus/schema'
import { hash } from 'argon2'
import { User } from '../users/users'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const Teacher = objectType({
  name: 'Teacher',
  definition(t) {
    t.implements(User)
    t.field('title', { type: TitleEnum })
    t.list.field('hasCourses', {
      type: 'Course',
      async resolve(parent, __, { courseData }) {
        const courses = await courseData
          .find({ 'hasTeacher.userName': parent.userName })
          .toArray()
        return courses
      },
    })
  },
})

export const TeacherRegistrationInput = inputObjectType({
  name: 'TeacherRegistrationInput',
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

export const TitleEnum = enumType({
  name: 'TitleEnum',
  members: ['MR', 'MRS', 'MS', 'MISS'],
})
export const TeacherRegistrationPayload = objectType({
  name: 'TeacherRegistrationPayload',
  definition(t) {
    t.field('teacher', { type: Teacher })
  },
})

export const teacherRegistration = mutationField('teacherRegistration', {
  type: TeacherRegistrationPayload,
  args: {
    input: arg({ type: TeacherRegistrationInput, required: true }),
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
      }
      const { insertedId } = await userData.insertOne(newTeacher)
      newTeacher._id = insertedId

      return { teacher: newTeacher }
    } else throw new Error(`${userName} already exists. Create a new username.`)
  },
})
