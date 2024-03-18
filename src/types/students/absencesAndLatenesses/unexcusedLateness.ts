import { objectType } from '@nexus/schema'
import { MarkingPeriodEnum, Student } from '../..'
import { LatenessTypeEnum } from './studentLateness'

export const UnexcusedLateness = objectType({
  name: 'UnexcusedLateness',
  definition(t) {
    // @ts-ignore
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.string('dayLate')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.field('latenessType', { type: LatenessTypeEnum })
  },
})
