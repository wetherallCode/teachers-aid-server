import { objectType, inputObjectType, enumType } from '@nexus/schema'

export const DevelopingOrganizer = objectType({
  name: 'DevelopingOrganizer',
  definition(t) {
    t.field('basicQuestionType', { type: BasicQuestionEnum, nullable: true })
    t.field('developingSentenceStructure', {
      type: DevelopingSentenceStructure,
    })
    t.string('restatement')
    t.string('answer')
    t.string('conclusion')
  },
})

export const BasicQuestionEnum = enumType({
  name: 'BasicQuestionEnum',
  members: ['HOW', 'WHY'],
})

export const DevelopingSentenceStructure = objectType({
  name: 'DevelopingSentenceStructure',
  definition(t) {
    t.string('subject')
    t.string('verb')
    t.string('object', { nullable: true })
    t.string('subjectCompliment', { nullable: true })
  },
})

export const DevelopingSentenceStructureInput = inputObjectType({
  name: 'DevelopingSentenceStructureInput',
  definition(t) {
    t.string('subject', { required: true })
    t.string('verb', { required: true })
    t.string('object')
    t.string('subjectCompliment')
  },
})

export const DevelopingOrganizerInput = inputObjectType({
  name: 'DevelopingOrganizerInput',
  definition(t) {
    t.string('questionType', { required: true })
    t.string('sentenceStructure', { required: true })
    t.string('restatement', { required: true })
    t.string('answer', { required: true })
    t.string('conclusion', { required: true })
  },
})
