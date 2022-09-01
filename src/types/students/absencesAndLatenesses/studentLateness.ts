import { objectType, enumType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { Student } from '../student'

export const StudentLateness = objectType({
  name: 'StudentLateness',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.string('dayLate')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.field('latenessType', { type: LatenessTypeEnum })
  },
})

export const LatenessTypeEnum = enumType({
  name: 'LatenessTypeEnum',
  members: ['EXCUSED', 'UNEXCUSED'],
})
