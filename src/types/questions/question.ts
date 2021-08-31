import { enumType, interfaceType } from '@nexus/schema'

export const Question = interfaceType({
  name: 'Question',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('questionUsageType', { type: QuestionUsageTypeEnum })
    t.resolveType((question) => {
      if (question.hasOwnProperty('questionParts')) {
        return 'EssayQuestion'
      }
      return 'EssentialQuestion'
    })
  },
})

export const QuestionUsageTypeEnum = enumType({
  name: 'QuestionUsageTypeEnum',
  members: ['ESSAY', 'TEST', 'ESSENTIAL_QUESTION'],
})
