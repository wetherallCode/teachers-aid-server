import { interfaceType, inputObjectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'

export const Protocol = interfaceType({
  name: 'Protocol',
  definition(t) {
    t.id('_id', { nullable: true })
    t.date('assignedDate')
    t.boolean('isActive')
    t.resolveType((protocol) => {
      if (protocol.hasOwnProperty('studentPair')) {
        return 'ThinkPairShare'
      }
      return 'Individual'
    })
  },
})

// export const ProtocolInput = inputObjectType({
//     name: 'ProtocolInput',
//     definition(t) {
//       t.date()
//     }
// })
