import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Quiz } from '.'

export const FindQuizByIdInput = inputObjectType({
  name: 'FindQuizByIdInput',
  definition(t) {
    t.id('quizId', { required: true })
  },
})

export const FindQuizByIdPayload = objectType({
  name: 'FindQuizByIdPayload',
  definition(t) {
    t.field('quiz', { type: Quiz })
  },
})

export const FindQuizById = queryField('findQuizById', {
  type: FindQuizByIdPayload,
  args: { input: arg({ type: FindQuizByIdInput, required: true }) },
  async resolve(_, { input: { quizId } }, { assignmentData }) {
    const quiz = await assignmentData.findOne({ _id: new ObjectId(quizId) })
    if (quiz) {
      return { quiz }
    } else throw new Error('Quiz does not exist!')
  },
})
