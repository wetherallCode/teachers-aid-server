import { interfaceType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'

export const Protocol = interfaceType({
  name: 'Protocol',
  definition(t) {
    t.string('period')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.date('assignedDate')
    t.boolean('isActive')
  },
})
