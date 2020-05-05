import { objectType, enumType } from '@nexus/schema'
import { QuestionTypeEnum } from '../assignments'

export const Section = objectType({
  name: 'Section',
  definition(t) {
    t.string('fromText')
    t.string('pages')
    t.list.field('hasProtocols', { type: SectionProtocols })
    t.list.field('vocab', { type: Vocab })
    t.list.string('hasQuestions')
  },
})

export const Vocab = objectType({
  name: 'Vocab',
  definition(t) {
    t.string('word')
    t.string('definition')
  },
})

export const SectionProtocols = objectType({
  name: 'Protocols',
  description: 'Protocol suggestions for including in a LessonPlan',
  definition(t) {
    t.field('activityType', { type: SectionProtocolActivityTypes })
    t.field('academicOutcomeTypes', { type: AcademicOutcomeTypes })
    t.string('element')
  },
})

export const SectionProtocolActivityTypes = enumType({
  name: 'SectionProtocolTypes',
  members: ['THINK_PAIR_SHARE'],
})

export const AcademicOutcomeTypes = enumType({
  name: 'AcademicOutomeTypes',
  members: ['SCHEMA_BUIDING', 'LOGIC_BUILDING', 'SOCRATIC_QUESTIONS'],
})

export const SectionQuestions = objectType({
  name: 'SectionQuestions',
  definition(t) {
    t.string('question')
    t.field('questionType', { type: QuestionTypeEnum })
  },
})
