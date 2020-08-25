import { objectType, queryField } from '@nexus/schema'
import { SchoolDayTracker } from '.'

export const FindSchoolDayTrackerPayload = objectType({
  name: 'FindSchoolDayPayload',
  definition(t) {
    t.field('schoolDayTracker', { type: SchoolDayTracker })
  },
})

export const FindSchoolDayTracker = queryField('findSchoolDayTracker', {
  type: FindSchoolDayTrackerPayload,

  async resolve(_, __, { schoolDayData }) {
    const schoolDayTracker = await schoolDayData.findOne({
      schoolDayTracker: { $exists: true },
    })
    return { schoolDayTracker }
  },
})
