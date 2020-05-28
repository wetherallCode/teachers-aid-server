import { objectType, queryField } from '@nexus/schema'
import { Unit } from '.'

export const FindUnitsPayload = objectType({
  name: 'FindUnitsPayload',
  definition(t) {
    t.list.field('units', { type: Unit })
  },
})

export const FindUnits = queryField('findUnits', {
  type: FindUnitsPayload,
  async resolve(_, __, { lessonData }) {
    const units = await lessonData
      .find({ unitName: { $exists: true } })
      .toArray()
    return { units }
  },
})
