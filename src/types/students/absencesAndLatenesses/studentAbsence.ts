import { objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { Student } from '..'

export const StudentAbsence = objectType({
  name: 'StudentAbsence',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.date('dayAbsent')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})
