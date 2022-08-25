import { objectType, enumType, inputObjectType } from '@nexus/schema'
import { ReadingGuideReviewOptionsEnum } from '../reading-guides'

export const SpecialAssignment = objectType({
  name: 'SpecialAssignment',
  definition(t) {
    t.implements('Assignment')
    t.list.field('questionAndAnswerList', { type: QuestionAndAnswerContainer })
    t.field('effort', { type: ReadingGuideReviewOptionsEnum })
    t.boolean('reviewed')
    t.boolean('completed')
    t.boolean('specialAssignmentGraded')
  },
})

export const QuestionAndAnswerContainer = objectType({
  name: 'QuestionAndAnswerContainer',
  definition(t) {
    t.string('question')
    t.string('answer')
  },
})
export const QuestionAndAnswerListInput = inputObjectType({
  name: 'QuestionAndAnswerListInput',
  definition(t) {
    t.string('question')
    t.string('answer')
  },
})
