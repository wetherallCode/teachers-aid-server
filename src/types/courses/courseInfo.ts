import { objectType } from '@nexus/schema'
import { SchoolDayType } from '../general/schoolDayType'
import { CourseTypeEnum, Course, StudentSeat } from '.'
import { Teacher } from '..'

export const CourseInfo = objectType({
  name: 'CourseInfo',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('course', { type: Course })
    t.string('startsAt')
    t.string('endsAt')
    t.string('halfDayStartsAt')
    t.string('halfDayEndsAt')
    t.boolean('cohortBasedSeating')
    t.field('hasTeacher', { type: Teacher })
    t.field('courseType', { type: CourseTypeEnum })
    t.field('schoolDayType', { type: SchoolDayType })
    t.list.field('assignedSeats', { type: StudentSeat })
  },
})
