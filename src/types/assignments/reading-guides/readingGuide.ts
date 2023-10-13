import { objectType, enumType } from '@nexus/schema'
import { ReadingGuideQuestion } from './readingGuideQuestion'

export const ReadingGuide = objectType({
  name: 'ReadingGuide',
  definition(t) {
    t.implements('Assignment')
    t.boolean('completed')
    t.boolean('graded')
    t.boolean('reviewed')
    t.field('effort', { type: ReadingGuideReviewOptionsEnum })
    t.field('readingGuideFinal', {
      type: ReadingGuideFinalContainer,
      nullable: true,
    })
  },
})

export const ReadingGuideFinalContainer = objectType({
  name: 'ReadingGuideFinalContainer',
  definition(t) {
    t.boolean('submitted')
    t.string('submitTime', { nullable: true })
    t.float('responsibilityPoints')
    t.list.field('readingGuideQuestions', {
      type: ReadingGuideQuestion,
      nullable: true,
    })
  },
})

export const InformationStructureEnum = enumType({
  name: 'InformationStructureEnum',
  members: ['PROBLEM_SOLUTION', 'CAUSE_EFFECT', 'COMPARE_CONTRAST', 'SEQUENCE'],
})

export const ReadingGuideReviewOptionsEnum = enumType({
  name: 'ReadingGuideReviewOptionsEnum',
  members: [
    'GOOD_EFFORT',
    'SOME_EFFORT',
    'LITTLE_EFFORT',
    'OFF_TOPIC',
    'USED_OUTSIDE_INFO',
    'DID_NOT_ANSWER_QUESTIONS_CORRECTLY',
    'NO_EFFORT',
  ],
})
