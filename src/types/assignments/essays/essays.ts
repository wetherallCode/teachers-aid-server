import { objectType, inputObjectType, enumType } from '@nexus/schema'

export const Essay = objectType({
  name: 'Essay',
  definition(t) {
    t.implements('Assignment')
    t.field('topic', { type: Topic })
    t.field('workingDraft', { type: WorkingDraft })
    t.field('finalDraft', { type: FinalDraftContainer, nullable: true })
  },
})

export const Topic = objectType({
  name: 'Topic',
  definition(t) {
    t.field('questionType', { type: QuestionTypeEnum })
    t.string('question')
  },
})

export const QuestionTypeEnum = enumType({
  name: 'QuestionTypeEnum',
  members: ['HOW_PROBLEM_SOLUTION', 'WHY_CAUSE_EFFECT', 'HOW_CAUSE_EFFECT'],
})

export const WorkingDraft = objectType({
  name: 'WorkingDraft',
  definition(t) {
    t.JSON('draft')
  },
})

export const FinalDraftContainer = objectType({
  name: 'FinalDraftContainer',
  definition(t) {
    t.field('submittedFinalDraft', { type: SubmittedFinalDraft })
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
    t.list.string('comments')
    t.int('score')
  },
})

export const SubmittedFinalDraftsInput = inputObjectType({
  name: 'SubmittedFinalDraftsInput',
  definition(t) {
    t.JSON('draft')
    t.JSON('gradingDraft')
    t.list.string('comments')
    t.int('score')
  },
})
