import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { SchoolDay } from '.'

export const FindSchoolDayByDateInput = inputObjectType({
  name: 'FindSchoolDayByDateInput',
  definition(t) {
    t.date('date', { required: true })
  },
})

export const FindSchoolDayByDatePayload = objectType({
  name: 'FindSchoolDayByDatePayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay, nullable: true })
  },
})

export const FindSchoolDayByDate = queryField('findSchoolDayByDate', {
  type: FindSchoolDayByDatePayload,
  args: { input: arg({ type: FindSchoolDayByDateInput, required: true }) },
  async resolve(_, { input: { date } }, { schoolDayData }) {
    const schoolDay = await schoolDayData.findOne({ todaysDate: date })
    return { schoolDay }
  },
})
