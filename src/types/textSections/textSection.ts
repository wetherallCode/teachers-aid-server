import { objectType, enumType, inputObjectType } from '@nexus/schema'
import { QuestionTypeEnum } from '../assignments'
import { Chapter } from '../texts'

export const TextSection = objectType({
  name: 'TextSection',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('fromChapter', { type: Chapter })
    t.field('pageNumbers', { type: PageNumbers })
    t.string('header')
    t.list.field('hasProtocols', { type: TextSectionProtocols })
    t.list.field('hasVocab', { type: TextSectionVocab })
    t.list.field('hasQuestions', { type: TextSectionQuestions })
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

export const TextSectionProtocols = objectType({
  name: 'TextSectionProtocols',
  description: 'Protocol suggestions for including in a LessonPlan',
  definition(t) {
    t.field('activityType', { type: ProtocolActivityTypes })
    t.field('academicOutcomeTypes', { type: AcademicOutcomeTypes })
    t.string('task')
  },
})

export const TextSectionProtocolsInput = inputObjectType({
  name: 'TextSectionProtocolsInput',
  definition(t) {
    t.field('activityType', {
      type: ProtocolActivityTypes,
      required: true,
    })
    t.field('academicOutcomeTypes', {
      type: AcademicOutcomeTypes,
      required: true,
    })
    t.string('task', { required: true })
  },
})

export const ProtocolActivityTypes = enumType({
  name: 'ProtocolActivityTypes',
  members: ['THINK_PAIR_SHARE'],
})

export const AcademicOutcomeTypes = enumType({
  name: 'AcademicOutomeTypes',
  members: ['SCHEMA_BUIDING', 'LOGIC_BUILDING', 'SOCRATIC_QUESTIONS'],
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
