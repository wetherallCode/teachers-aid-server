import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum, MarkingPeriod } from './markingPeriod'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const SetCurrentMarkingPeriodInput = inputObjectType({
  name: 'SetCurrentMarkingPeriodInput',
  definition(t) {
    t.field('currentMarkingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const SetCurrentMarkingPeriodPayload = objectType({
  name: 'SetCurrentMarkingPeriodPayload',
  definition(t) {
    t.field('markingPeriod', { type: MarkingPeriod })
  },
})

export const SetCurrentMarkingPeriod = mutationField(
  'setCurrentMarkingPeriod',
  {
    type: SetCurrentMarkingPeriodPayload,
    args: {
      input: arg({ type: SetCurrentMarkingPeriodInput, required: true }),
    },

    async resolve(_, { input: { currentMarkingPeriod } }, { generalData }) {
      await generalData.updateOne(
        {
          currentMarkingPeriod: { $exists: true },
        },
        {
          $set: { currentMarkingPeriod },
        }
      )
      const markingPeriod = await generalData.findOne({
        currentMarkingPeriod: { $exists: true },
      })
      return { markingPeriod }
    },
  }
)
