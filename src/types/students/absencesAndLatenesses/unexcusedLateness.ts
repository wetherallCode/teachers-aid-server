import { enumType, objectType } from '@nexus/schema'
import { Student, MarkingPeriodEnum } from '../..'
import { LatenessTypeEnum } from './studentLateness'

export const UnexcusedLateness = objectType({
  name: 'UnexcusedLateness',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.string('dayLate')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.field('latenessType', { type: LatenessTypeEnum })
  },
})
