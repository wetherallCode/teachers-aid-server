import { objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { Student } from '../student'
import { Course } from '../../courses'

export const ResponsibilityPoints = objectType({
  name: 'ResponsibilityPoints',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.float('responsibilityPoints')
    t.field('inCourse', { type: Course })
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})
