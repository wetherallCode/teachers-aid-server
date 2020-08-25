import { objectType, inputObjectType, enumType } from '@nexus/schema'
import { QuestionTypeEnum } from '../..'
import { WritingLevelEnum } from '../../students'
import { Organizers } from './organizers'
import { RubricEntry, RubricEntryInput } from './rubrics'

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
    t.field('questionType', { type: QuestionTypeEnum })
    t.string('question')
    t.field('writingLevel', { type: WritingLevelEnum })
  },
})

export const TopicInput = inputObjectType({
  name: 'TopicInput',
  definition(t) {
    t.string('question', { required: true })
    t.field('questionType', { type: QuestionTypeEnum, required: true })
    t.field('writingLevel', { type: WritingLevelEnum, required: true })
  },
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
