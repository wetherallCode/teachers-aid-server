import { enumType, objectType } from '@nexus/schema'

export const QuizQuestion = objectType({
  name: 'QuizQuestion',
  definition(t) {
    t.implements('Question')
    t.id('associatedTextSectionId')
    t.string('question')
    t.field('questionType', { type: QuizQuestionTypeEnum })
    t.field('difficultyLevel', { type: QuizQuestionDifficultyLevelEnum })
    t.list.field('answerList', { type: AnswerList })
    // t.list.field('individualQuestions', { type: IndividualQuizQuestion })
  },
})

// export const IndividualQuizQuestion = objectType({
//   name: 'IndividualQuizQuestion',
//   definition(t) {
//     t.string('question')
//     t.field('questionType', { type: QuizQuestionTypeEnum })
//     t.field('difficultyLevel', { type: QuizQuestionDifficultyLevelEnum })
//     t.list.field('answerList', { type: AnswerList })
//   },
// })

export const QuizQuestionDifficultyLevelEnum = enumType({
  name: 'QuizQuestionDifficultyLevelEnum',
  members: ['EASY', 'CHALLENGING', 'DIFFICULT'],
})

export const QuizQuestionTypeEnum = enumType({
  name: 'QuizQuestionTypeEnum',
  members: ['MULTIPLE_CHOICE', 'TRUE_FALSE'],
})

export const AnswerList = objectType({
  name: 'AnswerList',
  definition(t) {
    t.string('answer')
    t.boolean('correct')
    t.boolean('partiallyCorrect')
  },
})
