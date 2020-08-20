import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { SchoolDay, SchoolDayType } from '.'
import { StudentCohortEnum } from '../..'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const CreateSchoolDayInput = inputObjectType({
  name: 'CreateSchoolDayInput',
  definition(t) {
    t.field('currentSchoolDayType', { type: SchoolDayType })
    t.int('schoolDayCount')
    t.field('cohortWeek', { type: StudentCohortEnum })
  },
})

export const CreateSchoolDayPayload = objectType({
  name: 'CreateSchoolDayPayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay })
  },
})

// export const CreateSchoolDay = queryField('createSchoolDay', {
//   type: CreateSchoolDayPayload,
//   args: { input: arg({ type: CreateSchoolDayInput, required: true }) },
//   async resolve(
//     _,
//     { input: { currentSchoolDayType, schoolDayCount, cohortWeek } },
//     { schoolDayData }
//   ) {
//     const newSchoolDay: NexusGenRootTypes['SchoolDay'] = {}
//   },
// })
