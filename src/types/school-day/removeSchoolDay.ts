import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const RemoveSchoolDayInput = inputObjectType({
  name: 'RemoveSchoolDayInput',
  definition(t) {
    t.id('schoolDayId', { required: true })
  },
})

export const RemoveSchoolDayPayload = objectType({
  name: 'RemoveSchoolDayPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveSchoolDay = queryField('removeSchoolDay', {
  type: RemoveSchoolDayPayload,
  args: { input: arg({ type: RemoveSchoolDayInput, required: true }) },
  async resolve(_, { input: { schoolDayId } }, { schoolDayData }) {
    const schoolDayCheck = await schoolDayData.findOne({
      _id: new ObjectId(schoolDayId),
    })
    if (schoolDayCheck) {
      const { deletedCount } = await schoolDayData.deleteOne({
        _id: new ObjectId(schoolDayId),
      })

      if (deletedCount === 1) {
        return { removed: true }
      }
      return { removed: false }
    } else throw new Error('School Day does not exist')
  },
})
