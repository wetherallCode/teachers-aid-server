import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { SchoolDay } from '.'
import { ObjectId } from 'mongodb'

export const CreateSignInSheetInput = inputObjectType({
  name: 'CreateSignInSheetInput',
  definition(t) {
    t.id('todaysDate', { required: true })
    t.id('courseId', { required: true })
  },
})

export const CreateSignInSheetPayload = objectType({
  name: 'CreateSignInSheetPayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay })
  },
})

export const CreateSignInSheet = mutationField('createSignInSheet', {
  type: CreateSignInSheetPayload,
  args: { input: arg({ type: CreateSignInSheetInput, required: true }) },
  async resolve(
    _,
    { input: { todaysDate, courseId } },
    { schoolDayData, courseData }
  ) {
    const schoolDayCheck = await schoolDayData.findOne({
      todaysDate: todaysDate,
    })
    const course = await courseData.findOne({ _id: new ObjectId(courseId) })
    if (schoolDayCheck) {
      await schoolDayData.updateOne(
        { todaysDate: todaysDate },
        {
          $push: {
            signInSheets: {
              course: course,
              studentsSignInlog: [],
              lessonDate: todaysDate,
            },
          },
        }
      )
      const schoolDay = await schoolDayData.findOne({ todaysDate: todaysDate })
      return { schoolDay }
    } else throw new Error('School Day does not exist')
  },
})
