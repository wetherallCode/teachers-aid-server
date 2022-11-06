import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllProtocolsPayload = objectType({
  name: 'DeleteAllProtocolsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllProtocols = mutationField('deleteAllProtocols', {
  type: DeleteAllProtocolsPayload,
  async resolve(_, __, { protocolData }) {
    const { deletedCount } = await protocolData.deleteMany()

    // if (deletedCount === 1) {
    //   return { removed: true }
    // }
    return { removed: true }
  },
})
