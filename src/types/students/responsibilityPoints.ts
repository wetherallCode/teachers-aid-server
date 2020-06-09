import { objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'
import { Student } from './students'

export const ResponsibilityPoints = objectType({
  name: 'ResponsibilityPoints',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.int('responsibilityPoints')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})
