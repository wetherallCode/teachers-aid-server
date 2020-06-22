import { objectType, inputObjectType } from '@nexus/schema'
import { AnswerTypes } from './answerTypes'
import { QuestionTypeEnum } from '../../../textSections/textSection'

export const AdvancedOrganizer = objectType({
  name: 'AdvancedOrganizer',
  definition(t) {
    t.typeName
    t.field('questionType', { type: QuestionTypeEnum, nullable: true })
    t.field('answerType', { type: AnswerTypes, nullable: true })
    t.field('advancedSentenceStructure', { type: AdvancedSentenceStructure })
    t.string('restatement')
    t.string('conclusion')
  },
})

export const AdvancedSentenceStructure = objectType({
  name: 'AdvancedSentenceStructure',
  definition(t) {
    t.string('subject')
    t.string('verb')
    t.string('object', { nullable: true })
  },
})

export const AdvancedSentenceStructureInput = inputObjectType({
  name: 'AdvancedSentenceStructureInput',
  definition(t) {
    t.string('subject', { required: true })
    t.string('verb', { required: true })
    t.string('object')
  },
})
