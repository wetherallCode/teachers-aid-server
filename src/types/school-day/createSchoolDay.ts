import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { SchoolDay, SchoolDayLengthEnum, SchoolDayType } from '.'
import { StudentCohortEnum } from '..'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const CreateSchoolDayInput = inputObjectType({
  name: 'CreateSchoolDayInput',
  definition(t) {
    t.field('currentSchoolDayType', { type: SchoolDayType, required: true })
    t.int('schoolDayCount', { required: true })
    t.field('cohortWeek', { type: StudentCohortEnum, required: true })
    t.field('schoolDayLength', { type: SchoolDayLengthEnum, required: true })
  },
})

export const CreateSchoolDayPayload = objectType({
  name: 'CreateSchoolDayPayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay })
  },
})

export const CreateSchoolDay = mutationField('createSchoolDay', {
  type: CreateSchoolDayPayload,
  args: { input: arg({ type: CreateSchoolDayInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        currentSchoolDayType,
        schoolDayCount,
        cohortWeek,
        schoolDayLength,
      },
    },
    { schoolDayData }
  ) {
    const newSchoolDay: NexusGenRootTypes['SchoolDay'] = {
      cohortWeek,
      currentSchoolDayType,
      schoolDayCount,
      schoolDayLength,
      todaysDate: new Date().toLocaleDateString(),
      signInSheets: [],
    }
    const { insertedId } = await schoolDayData.insertOne(newSchoolDay)
    newSchoolDay._id = insertedId

    await schoolDayData.updateOne(
      { schoolDayTracker: { $exists: true } },
      {
        $set: {
          schoolDayTracker: schoolDayCount,
          cohortWeekTracker: cohortWeek,
          schoolDayTypeTracker: currentSchoolDayType,
        },
      }
    )

    return { schoolDay: newSchoolDay }
  },
})
