import { objectType, enumType } from '@nexus/schema'

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
    // t.list.field('howIsSectionOrganized', {
    //   type: InformationStructureEnum,
    //   nullable: true,
    // })
    // t.string('whyWasSectionOrganized', { nullable: true })
    // t.string('majorIssue')
    // t.boolean('majorIssueSolved')
    // t.string('majorSolution')
    // t.list.string('clarifyingQuestions')
    t.list.string('problems')
    t.string('biggestProblem')
    t.string('reasonForBiggestProblem')
    t.list.string('importantPeople')
    t.string('howArePeopleInvolvedInProblems')
    t.string('sectionConsequences')
    t.boolean('submitted')
    t.string('submitTime', { nullable: true })

    t.string('overall')
  },
})

export const InformationStructureEnum = enumType({
  name: 'InformationStructureEnum',
  members: ['PROBLEM_SOLUTION', 'CAUSE_EFFECT', 'COMPARE_CONTRAST', 'SEQUENCE'],
})

export const ReadingGuideReviewOptionsEnum = enumType({
  name: 'ReadingGuideReviewOptionsEnum',
  members: ['GOOD_EFFORT', 'SOME_EFFORT', 'LITTLE_EFFORT', 'NO_EFFORT'],
})
