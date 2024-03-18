import { enumType, inputObjectType, objectType } from '@nexus/schema'
import { Chapter } from '..'
import { TextSectionProtocols } from '.'

export const TextSection = objectType({
  name: 'TextSection',
  definition(t) {
    // @ts-ignore
    t.id('_id', { nullable: true })
    t.field('fromChapter', { type: Chapter })
    t.field('pageNumbers', { type: PageNumbers })
    t.string('header')
    // @ts-ignore
    t.int('orderNumber', { nullable: true })
    t.int('numberOfParagraphs')
    // @ts-ignore
    t.list.field('hasProtocols', { type: TextSectionProtocols, nullable: true })
    // @ts-ignore
    t.list.field('hasVocab', { type: TextSectionVocab, nullable: true })
    // @ts-ignore
    t.list.field('hasQuestions', { type: TextSectionQuestions, nullable: true })
    t.list.field('hasEssayQuestions', {
      type: 'EssayQuestion',
      async resolve(parent, __, { questionData }) {
        const essayQuestions = await questionData
          .find({
            questionUsageType: 'ESSAY',
            associatedTextSectionsIds: parent._id?.toString(),
          })
          .toArray()

        return essayQuestions
      },
    }),
      t.list.field('hasQuizQuestions', {
        type: 'QuizQuestion',
        async resolve(parent, __, { questionData }) {
          const quizQuestions = await questionData
            .find({
              questionUsageType: 'QUIZ',
              associatedTextSectionsIds: parent._id?.toString(),
            })
            .toArray()

          return quizQuestions
        },
      })
  },
})

export const PageNumbers = objectType({
  name: 'PageNumbers',
  definition(t) {
    t.int('startingPage')
    t.int('endingPage')
  },
})

export const PageNumbersInput = inputObjectType({
  name: 'PageNumbersInput',
  definition(t) {
    t.int('startingPage', { required: true })
    t.int('endingPage', { required: true })
  },
})

export const TextSectionVocab = objectType({
  name: 'TextSectionVocab',
  definition(t) {
    t.string('word')
    t.string('definition')
  },
})

export const TextSectionVocabInput = inputObjectType({
  name: 'TextSectionVocabInput',
  definition(t) {
    t.string('word', { required: true })
    t.string('definition', { required: true })
  },
})

export const QuestionTypeEnum = enumType({
  name: 'QuestionTypeEnum',
  members: ['HOW_PROBLEM_SOLUTION', 'HOW_CAUSE_EFFECT', 'WHY_CAUSE_EFFECT'],
})

export const TextSectionQuestions = objectType({
  name: 'TextSectionQuestions',
  definition(t) {
    t.string('question')
    t.field('questionType', { type: QuestionTypeEnum })
  },
})
export const TextSectionQuestionsInput = inputObjectType({
  name: 'TextSectionQuestionsInput',
  definition(t) {
    t.string('question', { required: true })
    t.field('questionType', { type: QuestionTypeEnum, required: true })
  },
})

// export const TextSectionInput = inputObjectType({
//   name: 'TextSectionInput',
//   definition(t) {},
// })
