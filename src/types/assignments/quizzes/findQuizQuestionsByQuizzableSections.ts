import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { QuizQuestion } from '../..'

export const FindQuizQuestionsByQuizzableSectionsInput = inputObjectType({
  name: 'FindQuizQuestionsByQuizzableSectionsInput',
  definition(t) {
    t.list.string('quizzableSectionIds', { required: true })
  },
})

export const FindQuizQuestionsByQuizzableSectionsPayload = objectType({
  name: 'FindQuizQuestionsByQuizzableSectionsPayload',
  definition(t) {
    t.list.field('quizQuestions', { type: QuizQuestion })
  },
})

export const FindQuizQuestionsByQuizzableSections = queryField(
  'findQuizQuestionsByQuizzableSections',
  {
    type: FindQuizQuestionsByQuizzableSectionsPayload,
    args: {
      input: arg({
        type: FindQuizQuestionsByQuizzableSectionsInput,
        required: true,
      }),
    },
    async resolve(_, { input: { quizzableSectionIds } }, { questionData }) {
      const quizQuestions = []
      for (const section of quizzableSectionIds) {
        const quizQuestionsBlock = await questionData
          .find({ associatedTextSectionId: section })
          .toArray()
        quizQuestions.push(...quizQuestionsBlock)
      }
      console.log(quizQuestions)
      return { quizQuestions }
    },
  }
)
