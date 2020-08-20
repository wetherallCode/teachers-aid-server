import { objectType } from '@nexus/schema'
import { SchoolDayType } from './schoolDayType'
import { StudentCohortEnum } from '../../students'

export const SchoolDay = objectType({
  name: 'SchoolDay',
  definition(t) {
    t.id('_id', { nullable: true })
    t.date('todaysDate')
    t.field('currentSchoolDayType', { type: SchoolDayType })
    t.int('schoolDayCount')
    t.field('cohortWeek', { type: StudentCohortEnum })
  },
})
