import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { SchoolDay, SchoolDayType } from '.'
import { StudentCohortEnum } from '../..'

export const UpdateSchoolDayInput = inputObjectType({
  name: 'UpdateSchoolDayInput',
  definition(t) {
    t.id('schoolDayId', { required: true })
    t.date('updatedDate', { required: true })
    t.field('updatedCurrentSchoolDayType', {
      type: SchoolDayType,
      required: true,
    })
    t.int('updatedSchoolDayCount', { required: true })
    t.field('updatedCohortWeek', { type: StudentCohortEnum, required: true })
  },
})

export const UpdateSchoolDayPayload = objectType({
  name: 'UpdateSchoolDayPayload',
  definition(t) {
    t.field('schoolDay', { type: SchoolDay })
  },
})

export const UpdateSchoolDay = mutationField('updateSchoolDay', {
  type: UpdateSchoolDayPayload,
  args: { input: arg({ type: UpdateSchoolDayInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        schoolDayId,
        updatedDate,
        updatedCurrentSchoolDayType,
        updatedSchoolDayCount,
        updatedCohortWeek,
      },
    },
    { schoolDayData }
  ) {
    const schoolDayCheck = await schoolDayData.findOne({
      _id: new ObjectId(schoolDayId),
    })
    if (schoolDayCheck) {
      await schoolDayData.updateOne(
        { _id: new ObjectId(schoolDayId) },
        {
          $set: {
            todaysDate: updatedDate,
            currentSchoolDayType: updatedCurrentSchoolDayType,
            schoolDayCount: updatedSchoolDayCount,
            cohortWeek: updatedCohortWeek,
          },
        }
      )
      const schoolDay = await schoolDayData.findOne({
        _id: new ObjectId(schoolDayId),
      })
      return { schoolDay }
    } else throw new Error('School Day does not exist.')
  },
})
