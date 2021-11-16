import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ChangeAllQuizzesToSecondMarkingPeriodPayload = objectType({
  name: 'ChangeAllQuizzesToSecondMarkingPeriodPayload',
  definition(t) {
    t.boolean('changed')
  },
})

export const ChangeAllQuizzesToSecondMarkingPeriod = mutationField(
  'changeAllQuizzesToSecondMarkingPeriod',
  {
    type: ChangeAllQuizzesToSecondMarkingPeriodPayload,
    // args: {
    //   input: arg({
    //     type: ChangeAllQuizzesToSecondMarkingPeriodInput,
    //     required: true,
    //   }),
    // },
    async resolve(_, __, { assignmentData }) {
      await assignmentData.updateMany(
        { quizzableSections: { $exists: true } },
        { $set: { markingPeriod: 'SECOND' } }
      )
      return { changed: true }
    },
  }
)
