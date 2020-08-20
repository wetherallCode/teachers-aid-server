import { enumType, objectType } from '@nexus/schema'

export const MarkingPeriod = objectType({
  name: 'MarkingPeriod',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('currentMarkingPeriod', { type: MarkingPeriodEnum })
  },
})

export const MarkingPeriodEnum = enumType({
  name: 'MarkingPeriodEnum',
  members: ['FIRST', 'SECOND', 'THIRD', 'FOURTH'],
})
