import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { QuizQuestion } from '.'

export const FindQuizQuestionsByTextSectionIdInput = inputObjectType({
  name: 'FindQuizQuestionsByTextSectionIdInput',
  definition(t) {
    t.id('associatedTextSectionId', { required: true })
  },
})

export const FindQuizQuestionsByTextSectionIdPayload = objectType({
  name: 'FindQuizQuestionsByTextSectionIdPayload',
  definition(t) {
    t.list.field('quizQuestions', { type: QuizQuestion })
  },
})

export const FindQuizQuestionsByTextSectionId = queryField(
  'findQuizQuestionsByTextSectionId',
  {
    type: FindQuizQuestionsByTextSectionIdPayload,
    args: {
      input: arg({
        type: FindQuizQuestionsByTextSectionIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { associatedTextSectionId } }, { questionData }) {
      const quizQuestions = await questionData
        .find({ associatedTextSectionId })
        .toArray()
      return { quizQuestions }
    },
  }
)
