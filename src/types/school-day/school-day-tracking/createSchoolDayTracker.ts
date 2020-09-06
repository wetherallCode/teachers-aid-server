import { objectType, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { SchoolDayTracker } from '.'

export const CreateSchoolDayTrackerPayload = objectType({
  name: 'CreateSchoolDayTrackerPayload',
  definition(t) {
    t.field('schoolDayTracker', { type: SchoolDayTracker })
  },
})

export const CreateSchoolDayTracker = mutationField('createSchoolDayTracker', {
  type: CreateSchoolDayTrackerPayload,

  async resolve(_, __, { schoolDayData }) {
    const schoolDayTracker: NexusGenRootTypes['SchoolDayTracker'] = {
      schoolDayTracker: 0,
      cohortWeekTracker: 'RED',
      schoolDayTypeTracker: 'A',
    }
    const { insertedId } = await schoolDayData.insertOne(schoolDayTracker)
    schoolDayTracker._id = insertedId
    return { schoolDayTracker }
  },
})
