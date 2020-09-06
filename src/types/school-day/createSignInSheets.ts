import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { SchoolDay, StudentQuestions } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

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
    const schoolDayCheck: NexusGenRootTypes['SchoolDay'] = await schoolDayData.findOne(
      {
        todaysDate: todaysDate,
      }
    )

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

        const newStudentQuestions: NexusGenRootTypes['StudentQuestions'] = {
          associatedSchoolDayId: schoolDayCheck._id!,
          course,
          questions: [],
          date: new Date().toLocaleDateString(),
        }
        const { insertedId } = await schoolDayData.insertOne(
          newStudentQuestions
        )
        newStudentQuestions._id = insertedId
      }

      const schoolDay = await schoolDayData.findOne({ todaysDate: todaysDate })
      return { schoolDay }
    } else throw new Error('School Day does not exist')
  },
})
