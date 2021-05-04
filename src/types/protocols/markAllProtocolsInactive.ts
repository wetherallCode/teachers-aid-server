import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const MarkAllProtocolsInactivePayload = objectType({
  name: 'MarkAllProtocolsInactivePayload',
  definition(t) {
    t.boolean('inactive')
  },
})

export const MarkAllProtocolsInactive = mutationField(
  'markAllProtocolsInactive',
  {
    type: MarkAllProtocolsInactivePayload,

    async resolve(_, __, { protocolData }) {
      await protocolData.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      )
      return { inactive: true }
    },
  }
)
