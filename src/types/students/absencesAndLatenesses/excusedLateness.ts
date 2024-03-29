import { objectType } from '@nexus/schema'
import { Student } from '../..'
import { MarkingPeriodEnum } from '../../general'
import { LatenessTypeEnum } from './studentLateness'

export const ExcusedLateness = objectType({
  name: 'ExcusedLateness',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.string('dayLate')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.field('latenessType', { type: LatenessTypeEnum })
  },
})
