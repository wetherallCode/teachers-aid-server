import { objectType, mutationField, arg, inputObjectType } from '@nexus/schema'
import { hash } from 'argon2'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { Student, StudentCohortEnum } from '.'

export const RegisterStudentInput = inputObjectType({
  name: 'RegisterStudentInput',
  definition(t) {
    t.string('email')
    t.string('password', { required: true })
    t.string('userName', { required: true })
    t.string('middleName')
    t.string('schoolId')
    t.field('cohort', { type: StudentCohortEnum, required: true })
    t.boolean('virtual', { required: true })
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
    {
      input: {
        userName,
        firstName,
        lastName,
        email,
        password,
        middleName,
        virtual,
        schoolId,
        cohort,
      },
    },
    { userData }
  ) {
    let existingUser = await userData.findOne({ userName })
    if (!existingUser) {
      if (userName && firstName && lastName) {
        const hashedPassword = await hash(password)

        let newStudent: NexusGenRootTypes['Student'] = {
          email,
          password: hashedPassword,
          userName,
          firstName,
          middleName,
          schoolId,
          lastName,
          virtual,
          cohort,
          inCourses: [],
        }
        const { insertedId } = await userData.insertOne(newStudent)
        newStudent._id = insertedId

        return { student: newStudent }
      } else throw new Error('Missing info')
    } else throw new Error(`${userName} already exists. Create a new username.`)
  },
})
