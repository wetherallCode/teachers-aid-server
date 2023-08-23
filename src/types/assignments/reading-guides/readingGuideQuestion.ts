import { inputObjectType, objectType } from '@nexus/schema'
import { ReadingGuideMetricEnum } from '../../students'

export const ReadingGuideQuestion = objectType({
  name: 'ReadingGuideQuestion',
  definition(t) {
    t.string('answer')
    t.string('questionType')
  },
})

export const ReadingGuideQuestionInput = inputObjectType({
  name: 'ReadingGuideQuestionInput',
  definition(t) {
    t.string('answer', { nullable: true })
    t.string('questionType', { nullable: true })
  },
})
