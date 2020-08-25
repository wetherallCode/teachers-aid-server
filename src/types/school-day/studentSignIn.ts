import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { SchoolDay } from '.'
import { ObjectId } from 'mongodb'

export const StudentSignInInput = inputObjectType({
  name: 'StudentSignInInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.id('courseId', { required: true })
    t.string('lessonDate', { required: true })
    t.boolean('virtual')
  },
})

export const StudentSignInPayload = objectType({
  name: 'StudentSignInPayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay })
  },
})

export const StudentSignIn = mutationField('studentSignIn', {
  type: StudentSignInPayload,
  args: { input: arg({ type: StudentSignInInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, lessonDate, courseId } },
    { schoolDayData, userData }
  ) {
    const student = await userData.findOne({ _id: new ObjectId(studentId) })

    if (student) {
      await schoolDayData.updateOne(
        {
          todaysDate: lessonDate,
          signInSheets: {
            $elemMatch: { 'course._id': new ObjectId(courseId) },
          },
        },
        {
          $push: { 'signInSheets.$.studentsSignInlog': student },
        }
      )
    }

    const schoolDay = await schoolDayData.findOne({ todaysDate: lessonDate })
    return { schoolDay }
  },
})
