import { enumType, inputObjectType, objectType } from '@nexus/schema'
import { QuestionTypeEnum } from '../..'

import { Organizers } from './organizers'
import { RubricEntry, RubricEntryInput } from './rubrics'
import { WritingLevelEnum } from '../../students/progress-metrics/progressTracker'

export const Essay = objectType({
  name: 'Essay',
  definition(t) {
    t.implements('Assignment')
    t.field('topic', { type: Topic })
    t.field('workingDraft', { type: WorkingDraft })
    t.field('finalDraft', { type: FinalDraftContainer, nullable: true })
    t.boolean('leveledUp')
  },
})

export const Topic = objectType({
  name: 'Topic',
  definition(t) {
    t.string('question')
    t.field('questionType', { type: QuestionTypeEnum })
    t.field('writingLevel', { type: WritingLevelEnum })
    t.id('essayQuestionId')
  },
})

export const TopicInput = inputObjectType({
  name: 'TopicInput',
  definition(t) {
    t.string('question', { required: true })
    t.field('questionType', { type: QuestionTypeEnum, required: true })
    t.field('writingLevel', { type: WritingLevelEnum, required: true })
    t.id('essayQuestionId', { required: true })
  },
})

export const QuestionPartsContainer = objectType({
  name: 'QuestionPartsContainer',
  definition(t) {
    t.string('originalQuestion')
    t.string('modifiedQuestion')
    t.field('questionWord', { type: QuestionWordEnum })
    t.string('helpingVerb')
    t.string('completeSubject')
    t.string('simpleSubject')
    t.field('nounType', { type: NounTypeEnum })
    t.field('verbType', { type: VerbTypeEnum })
    t.boolean('compoundNoun')
    t.string('completePredicate')
    t.string('simplePredicate')
    t.string('object', { nullable: true })
    t.string('subjectCompliment', { nullable: true })
    t.field('questionType', { type: QuestionTypeEnum })
  },
})

export const QuestionPartsContainerInput = inputObjectType({
  name: 'QuestionPartsContainerInput',
  definition(t) {
    t.string('originalQuestion', { required: true })
    t.string('modifiedQuestion', { required: true })
    t.field('questionWord', { type: QuestionWordEnum, required: true })
    t.string('helpingVerb', { required: true })
    t.string('completeSubject', { required: true })
    t.string('simpleSubject', { required: true })
    t.field('nounType', { type: NounTypeEnum, required: true })
    t.field('verbType', { type: VerbTypeEnum, required: true })
    t.boolean('compoundNoun', { required: true })
    t.string('completePredicate', { required: true })
    t.string('simplePredicate', { required: true })
    t.string('object')
    t.string('subjectCompliment')
    t.field('questionType', { type: QuestionTypeEnum, required: true })
  },
})

export const QuestionWordEnum = enumType({
  name: 'QuestionWordEnum',
  members: ['HOW', 'WHY'],
})

export const NounTypeEnum = enumType({
  name: 'NounTypeEnum',
  members: [
    'PERSON',
    'PEOPLE',
    'PLACE',
    'PLACES',
    'THING',
    'THINGS',
    'IDEAS',
    'IDEA',
  ],
})

export const VerbTypeEnum = enumType({
  name: 'VerbTypeEnum',
  members: ['ACTION', 'BEING', 'FEELING', 'HAVING'],
})

export const ReadingsInput = inputObjectType({
  name: 'ReadingsInput',
  definition(t) {
    t.string('readingPages', { required: true })
    t.string('readingSections', { required: true })
  },
})

export const WorkingDraft = objectType({
  name: 'WorkingDraft',
  definition(t) {
    // @ts-ignore
    t.field('organizer', { type: Organizers, nullable: true })
    t.string('draft')
  },
})

export const FinalDraftContainer = objectType({
  name: 'FinalDraftContainer',
  definition(t) {
    t.list.field('submittedFinalDraft', { type: SubmittedFinalDraft })
    t.boolean('submitted')
    t.boolean('returned')
    t.dateTime('submitTime', { nullable: true })
  },
})

export const SubmittedFinalDraft = objectType({
  name: 'SubmittedFinalDraft',
  definition(t) {
    t.JSON('draft')
    t.JSON('gradingDraft')
    t.int('draftNumber')
    t.list.field('rubricEntries', { type: RubricEntry })
    t.list.string('additionalComments', { nullable: true })
    t.float('score')
    t.boolean('graded')
  },
})

export const SubmittedFinalDraftsInput = inputObjectType({
  name: 'SubmittedFinalDraftsInput',
  definition(t) {
    t.JSON('draft', { required: true })
    t.JSON('gradingDraft', { required: true })
    t.int('draftNumber', { required: true })
    t.list.field('rubricEntries', { type: RubricEntryInput, required: true })
    t.list.string('additionalComments')
    t.float('score', { required: true })
    t.boolean('graded', { required: true })
  },
})
