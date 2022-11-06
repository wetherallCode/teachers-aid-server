import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllSchoolDaysPayload = objectType({
  name: 'DeleteAllSchoolDaysPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllSchoolDays = mutationField('deleteAllSchoolDays', {
  type: DeleteAllSchoolDaysPayload,

  async resolve(_, __, { schoolDayData }) {
    const { deletedCount } = await schoolDayData.deleteMany()

    // if (deletedCount === 1) {
    //   return { removed: true }
    // }
    return { removed: true }
  },
})
