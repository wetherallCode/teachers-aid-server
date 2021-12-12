import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const SchoolDayModifierPayload = objectType({
  name: 'SchoolDayModifierPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const SchoolDayModifier = mutationField('schoolDayModifier', {
  type: SchoolDayModifierPayload,
  // args: { input: arg({ type: SchoolDayModifierInput, required: true }) },
  async resolve(_, __, { schoolDayData }) {
    schoolDayData
    // await schoolDayData.updateMany(
    //   { schoolDayCount: { $exists: true } },
    //   { $set: { schoolDayLength: 'FULL' } }
    // )
    return { modified: true }
  },
})
