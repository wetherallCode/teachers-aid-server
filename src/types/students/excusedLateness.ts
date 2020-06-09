import { objectType } from '@nexus/schema'
import { Student } from '..'
import { MarkingPeriodEnum } from '../general'

export const ExcusedLateness = objectType({
  name: 'ExcusedLateness',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.date('dayLateExcused')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})
