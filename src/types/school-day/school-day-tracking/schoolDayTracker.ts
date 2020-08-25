import { objectType } from '@nexus/schema'
import { StudentCohortEnum, SchoolDayType } from '../..'

export const SchoolDayTracker = objectType({
  name: 'SchoolDayTracker',
  definition(t) {
    t.id('_id', { nullable: true })
    t.int('schoolDayTracker')
    t.field('schoolDayTypeTracker', { type: SchoolDayType })
    t.field('cohortWeekTracker', { type: StudentCohortEnum })
  },
})
