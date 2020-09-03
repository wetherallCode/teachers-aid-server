import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { SchoolDay } from '.'
import { ObjectId } from 'mongodb'

export const CreateSignInSheetsInput = inputObjectType({
  name: 'CreateSignInSheetsInput',
  definition(t) {
    t.list.id('courseIds', { required: true })
    t.string('todaysDate', { required: true })
  },
})

export const CreateSignInSheetsPayload = objectType({
  name: 'CreateSignInSheetsPayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay })
  },
})

export const CreateSignInSheets = mutationField('createSignInSheets', {
  type: CreateSignInSheetsPayload,
  args: { input: arg({ type: CreateSignInSheetsInput, required: true }) },
  async resolve(
    _,
    { input: { todaysDate, courseIds } },
    { schoolDayData, courseData }
  ) {
    const schoolDayCheck = await schoolDayData.findOne({
      todaysDate: todaysDate,
    })

    if (schoolDayCheck) {
      for (const _id of courseIds) {
        const course = await courseData.findOne({
          _id: new ObjectId(_id),
        })

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
      }
      const schoolDay = await schoolDayData.findOne({ todaysDate: todaysDate })
      return { schoolDay }
    } else throw new Error('School Day does not exist')
  },
})
