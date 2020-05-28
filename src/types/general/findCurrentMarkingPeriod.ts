import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { MarkingPeriod } from '.'
import { ObjectId } from 'mongodb'

export const FindCurrentMarkingPeriodInput = inputObjectType({
  name: 'FindCurrentMarkingPeriodInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const FindCurrentMarkingPeriodPayload = objectType({
  name: 'FindCurrentMarkingPeriodPayload',
  definition(t) {
    t.field('markingPeriod', { type: MarkingPeriod })
  },
})

export const FindCurrentMarkingPeriod = queryField('findCurrentMarkingPeriod', {
  type: FindCurrentMarkingPeriodPayload,

  async resolve(_, __, { generalData }) {
    const markingPeriod = await generalData.findOne({
      currentMarkingPeriod: { $exists: true },
    })
    return { markingPeriod }
  },
})
