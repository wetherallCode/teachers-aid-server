import { objectType, enumType, inputObjectType } from '@nexus/schema'
import { Chapter } from '../texts'
import { TextSectionProtocols } from '.'

export const TextSection = objectType({
  name: 'TextSection',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('fromChapter', { type: Chapter })
    t.field('pageNumbers', { type: PageNumbers })
    t.string('header')
    t.list.field('hasProtocols', { type: TextSectionProtocols, nullable: true })
    t.list.field('hasVocab', { type: TextSectionVocab, nullable: true })
    t.list.field('hasQuestions', { type: TextSectionQuestions, nullable: true })
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
