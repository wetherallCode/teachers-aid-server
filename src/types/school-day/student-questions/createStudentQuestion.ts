import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { StudentQuestions } from './studentQuestion'
import { ObjectId } from 'mongodb'

export const CreateStudentQuestionInput = inputObjectType({
  name: 'CreateStudentQuestionInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.id('courseId', { required: true })
    t.string('question', { required: true })
  },
})

export const CreateStudentQuestionPayload = objectType({
  name: 'CreateStudentQuestionPayload',
  definition(t) {
    t.field('studentQuestions', { type: StudentQuestions })
  },
})

export const CreateStudentQuestion = mutationField('createStudentQuestion', {
  type: CreateStudentQuestionPayload,
  args: { input: arg({ type: CreateStudentQuestionInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, courseId, question } },
    { schoolDayData, userData }
  ) {
    const studentQuestionsCheck = await schoolDayData.findOne({
      date: new Date().toLocaleDateString(),
      'course._id': new ObjectId(courseId),
      questions: { $exists: true },
    })

    if (studentQuestionsCheck) {
      const student = await userData.findOne({ _id: new ObjectId(studentId) })
      await schoolDayData.updateOne(
        {
          date: new Date().toLocaleDateString(),
          'course._id': new ObjectId(courseId),
          questions: { $exists: true },
        },
        {
          $push: {
            questions: {
              student,
              timeAsked: new Date().toLocaleTimeString(),
              question,
            },
          },
        }
      )
      const studentQuestions = await schoolDayData.findOne({
        date: new Date().toLocaleDateString(),
        questions: { $exists: true },
      })
      return { studentQuestions }
    } else throw new Error('Student Questions do not exist')
  },
})
