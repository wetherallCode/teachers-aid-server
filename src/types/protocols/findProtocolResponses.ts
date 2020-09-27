import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Protocol } from '.'

export const FindProtocolResponsesInput = inputObjectType({
  name: 'FindProtocolResponsesInput',
  definition(t) {
    t.id('protocolId', { required: true })
  },
})

export const FindProtocolResponsesPayload = objectType({
  name: 'FindProtocolResponsesPayload',
  definition(t) {
    t.field('protocol   ', { type: Protocol })
  },
})

// export const FindProtocolResponses = queryField('findProtocolResponses', {
//   type: FindProtocolResponsesPayload,
//   args: { input: arg({ type: FindProtocolResponsesInput, required: true }) },
//   async resolve(_, { input: {} }, {}) {},
// })
