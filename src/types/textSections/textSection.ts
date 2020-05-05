import { objectType, enumType, inputObjectType } from '@nexus/schema'
import { QuestionTypeEnum } from '../assignments'

export const TextSection = objectType({
  name: 'TextSection',
  definition(t) {
    t.string('fromText')
    t.string('pages')
    t.string('header')
    t.list.field('hasProtocols', { type: TextSectionProtocols })
    t.list.field('vocab', { type: Vocab })
    t.list.field('hasQuestions', { type: TextSectionQuestions })
  },
})

export const Vocab = objectType({
  name: 'Vocab',
  definition(t) {
    t.string('word')
    t.string('definition')
  },
})
export const VocabInput = inputObjectType({
  name: 'VocabInput',
  definition(t) {
    t.string('word')
    t.string('definition')
  },
})

export const TextSectionProtocols = objectType({
  name: 'Protocols',
  description: 'Protocol suggestions for including in a LessonPlan',
  definition(t) {
    t.field('activityType', { type: TextSectionProtocolActivityTypes })
    t.field('academicOutcomeTypes', { type: AcademicOutcomeTypes })
    t.string('element')
  },
})

export const TextSectionProtocolsInput = inputObjectType({
  name: 'TextSectionProtocolsInput',
  definition(t) {
    t.field('activityType', { type: TextSectionProtocolActivityTypes })
    t.field('academicOutcomeTypes', { type: AcademicOutcomeTypes })
    t.string('element')
  },
})

export const TextSectionProtocolActivityTypes = enumType({
  name: 'TextSectionProtocolTypes',
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
    t.string('question')
    t.field('questionType', { type: QuestionTypeEnum })
  },
})
