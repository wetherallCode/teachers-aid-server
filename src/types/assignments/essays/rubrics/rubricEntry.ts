import { objectType, enumType } from '@nexus/schema'
import { WritingLevelEnum } from '../../../students/progress-metrics/writingMetrics'

export const RubricEntry = objectType({
  name: 'RubricEntry',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('entry')
    t.int('score')
    t.field('rubricSection', { type: RubricSectionEnum })
    t.list.field('rubricWritingLevels', { type: WritingLevelEnum })
  },
})

export const RubricSectionEnum = enumType({
  name: 'RubricSectionEnum',
  members: ['OVERALL', 'GENERAL', 'TOPIC', 'ANSWER', 'CONCLUSION'],
})
