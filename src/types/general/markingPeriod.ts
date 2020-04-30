import { enumType } from '@nexus/schema'

export const MarkingPeriodEnum = enumType({
  name: 'MarkingPeriodEnum',
  members: ['FIRST', 'SECOND', 'THIRD', 'FOURTH'],
})
