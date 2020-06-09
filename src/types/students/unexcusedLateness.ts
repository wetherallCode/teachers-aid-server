import { objectType } from '@nexus/schema'
import { Student, MarkingPeriodEnum } from '..'

export const UnexcusedLateness = objectType({
  name: 'UnexcusedLateness',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.date('dayLate')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})
