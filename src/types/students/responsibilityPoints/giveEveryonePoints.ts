import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../..'

export const GiveEveryonePointsInput = inputObjectType({
  name: 'GiveEveryonePointsInput',
  definition(t) {
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const GiveEveryonePointsPayload = objectType({
  name: 'GiveEveryonePointsPayload',
  definition(t) {
    t.boolean('awarded')
  },
})

// export const GiveEveryonePoints = mutationField('giveEveryonePoints', {
//   type: GiveEveryonePointsPayload,
//   args: { input: arg({ type: GiveEveryonePointsInput, required: true }) },
//   async resolve(_, { input: { markingPeriod } }, { studentData }) {
//     studentData.update({})
//     return { removed: true }
//   },
// })
