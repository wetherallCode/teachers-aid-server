import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import {
  QuizQuestion,
  QuizQuestionDifficultyLevelEnum,
  QuizQuestionTypeEnum,
} from '.'

export const CreateQuizQuestionInput = inputObjectType({
  name: 'CreateQuizQuestionInput',
  definition(t) {
    t.id('associatedTextSectionId', { required: true })
    t.string('question', { required: true })
    t.field('questionType', { required: true, type: QuizQuestionTypeEnum })
    t.field('difficultyLevel', {
      required: true,
      type: QuizQuestionDifficultyLevelEnum,
    })
    t.list.field('answerList', { required: true, type: AnswerListInput })
    // t.list.field('individualQuestions', {
    //   required: true,
    //   type: IndividualQuizQuestionInput,
    // })
  },
})

// export const IndividualQuizQuestionInput = inputObjectType({
//   name: 'IndividualQuizQuestionInput',
//   definition(t) {
//     t.string('question', { required: true })
//     t.field('questionType', { required: true, type: QuizQuestionTypeEnum })
//     t.field('difficultyLevel', {
//       required: true,
//       type: QuizQuestionDifficultyLevelEnum,
//     })
//     t.list.field('answerList', { required: true, type: AnswerListInput })
//   },
// })

export const AnswerListInput = inputObjectType({
  name: 'AnswerListInput',
  definition(t) {
    t.string('answer', { required: true })
    t.boolean('correct', { required: true })
    t.boolean('partiallyCorrect', { required: true })
  },
})

export const CreateQuizQuestionPayload = objectType({
  name: 'CreateQuizQuestionPayload',
  definition(t) {
    t.field('quizQuestion', { type: QuizQuestion })
  },
})

export const CreateQuizQuestion = mutationField('createQuizQuestion', {
  type: CreateQuizQuestionPayload,
  args: { input: arg({ type: CreateQuizQuestionInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        associatedTextSectionId,
        question,
        answerList,
        difficultyLevel,
        questionType,
      },
    },
    { questionData }
  ) {
    const quizQuestion: NexusGenRootTypes['QuizQuestion'] = {
      associatedTextSectionId,
      questionUsageType: 'QUIZ',
      answerList,
      difficultyLevel,
      question,
      questionType,
    }
    const { insertedId } = await questionData.insertOne(quizQuestion)
    quizQuestion._id = insertedId

    return { quizQuestion }
  },
})
