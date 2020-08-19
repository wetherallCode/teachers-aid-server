import { objectType, enumType } from '@nexus/schema'

export const ReadingGuide = objectType({
  name: 'ReadingGuide',
  definition(t) {
    t.implements('Assignment')
    t.boolean('completed')
    t.boolean('graded')
    t.field('readingGuideFinal', {
      type: ReadingGuideFinalContainer,
      nullable: true,
    })
  },
})

export const ReadingGuideFinalContainer = objectType({
  name: 'ReadingGuideFinalContainer',
  definition(t) {
    t.list.field('howIsSectionOrganized', { type: InformationStructureEnum })
    t.string('whyWasSectionOrganized')
    t.string('majorIssue')
    t.boolean('majorIssueSolved')
    t.string('majorSolution')
    t.list.string('clarifyingQuestions')

    t.boolean('submitted')
    t.string('submitTime', { nullable: true })
  },
})

export const InformationStructureEnum = enumType({
  name: 'InformationStructureEnum',
  members: ['PROBLEM_SOLUTION', 'CAUSE_EFFECT', 'COMPARE_CONTRAST', 'SEQUENCE'],
})
