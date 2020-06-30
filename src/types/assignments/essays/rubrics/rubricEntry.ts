import { objectType, enumType, inputObjectType } from '@nexus/schema'
import { WritingLevelEnum } from '../../../students/progress-metrics/writingMetrics'

export const RubricEntry = objectType({
  name: 'RubricEntry',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('entry')
    t.int('score')
    t.field('rubricSection', { type: RubricSectionEnum })
    t.list.field('rubricWritingLevels', { type: WritingLevelEnum })
    // t.field('rubricWritingLevel', { type: WritingLevelEnum })
    // t.list.field('linkedWritingLevels', { type: WritingLevelEnum })
  },
})

export const RubricEntryInput = inputObjectType({
  name: 'RubricEntryInput',
  definition(t) {
    t.string('entry', { required: true })
    t.int('score', { required: true })
    t.field('rubricSection', { type: RubricSectionEnum, required: true })
    t.list.field('rubricWritingLevels', {
      type: WritingLevelEnum,
      required: true,
    })
  },
})

export const RubricSectionEnum = enumType({
  name: 'RubricSectionEnum',
  members: ['OVERALL', 'GENERAL', 'TOPIC', 'ANSWER', 'CONCLUSION'],
})
