import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { StudentQuestions } from '.'

export const CreateStudentQuestionsContainerInput = inputObjectType({
  name: 'CreateStudentQuestionsContainerInput',
  definition(t) {
    t.id('associatedSchoolDayId', { required: true })
    t.id('courseId', { required: true })
    t.string('date', { required: true })
  },
})

export const CreateStudentQuestionsContainerPayload = objectType({
  name: 'CreateStudentQuestionsContainerPayload',
  definition(t) {
    t.field('studentQuestions', { type: StudentQuestions })
  },
})

export const CreateStudentQuestionsContainer = mutationField(
  'createStudentQuestionsContainer',
  {
    type: CreateStudentQuestionsContainerPayload,
    args: {
      input: arg({
        type: CreateStudentQuestionsContainerInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { associatedSchoolDayId, courseId, date } },
      { schoolDayData, courseData }
    ) {
      const course = await courseData.findOne({ _id: new ObjectId(courseId) })
      const newStudentQuestions: NexusGenRootTypes['StudentQuestions'] = {
        associatedSchoolDayId: associatedSchoolDayId,
        course,
        questions: [],
        date,
      }
      const { insertedId } = await schoolDayData.insertOne(newStudentQuestions)
      newStudentQuestions._id = insertedId
      return { studentQuestions: newStudentQuestions }
    },
  }
)
