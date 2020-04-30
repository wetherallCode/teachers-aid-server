import { objectType, mutationField, arg, inputObjectType } from '@nexus/schema'
import { hash } from 'argon2'
import { User } from '../users'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const Student = objectType({
  name: 'Student',
  definition(t) {
    t.implements(User)
    t.list.field('hasAssignments', {
      type: 'Assignment',
      async resolve(parent, __, { assignmentData }) {
        const assignments = await assignmentData
          .find({ 'hasOwner.userName': parent.userName })
          .toArray()

        return assignments
      },
    })
    t.list.field('inCourses', {
      type: 'Course',
      async resolve(parent, __, { courseData }) {
        const courses = await courseData
          .find({ 'hasStudents.userName': parent.userName })
          .toArray()
        return courses
      },
    })
  },
})

export const StudentRegistrationInput = inputObjectType({
  name: 'StudentRegistrationInput',
  definition(t) {
    t.string('email', { required: true })
    t.string('password', { required: true })
    t.string('userName', { required: true })
    t.string('firstName', { required: true })
    t.string('lastName', { required: true })
  },
})

export const StudentRegistrationPayload = objectType({
  name: 'StudentRegistrationPayload',
  definition(t) {
    t.field('student', { type: Student })
  },
})

export const StudentRegistration = mutationField('studentRegistration', {
  type: StudentRegistrationPayload,
  args: {
    input: arg({ type: StudentRegistrationInput, required: true }),
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
      }
      const { insertedId } = await userData.insertOne(newStudent)
      newStudent._id = insertedId

      return { student: newStudent }
    } else throw new Error(`${userName} already exists. Create a new username.`)
  },
})
