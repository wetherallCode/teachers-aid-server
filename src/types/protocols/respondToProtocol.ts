import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol } from '.'
import { ObjectId } from 'mongodb'

export const RespondToProtocolInput = inputObjectType({
  name: 'RespondToProtocolInput',
  definition(t) {
    t.id('protocolId', { required: true })
    t.string('response', { required: true })
  },
})

export const RespondToProtocolPayload = objectType({
  name: 'RespondToProtocolPayload',
  definition(t) {
    t.field('protocol', { type: Protocol })
  },
})

export const RespondToProtocol = mutationField('respondToProtocol', {
  type: RespondToProtocolPayload,
  args: { input: arg({ type: RespondToProtocolInput, required: true }) },
  async resolve(_, { input: { protocolId, response } }, { protocolData }) {
    const protocolCheck = await protocolData.findOne({
      _id: new ObjectId(protocolId),
    })

    if (protocolCheck) {
      await protocolData.updateOne(
        {
          _id: new ObjectId(protocolId),
        },
        {
          $set: { response },
        }
      )
    }

    const protocol = await protocolData.findOne({
      _id: new ObjectId(protocolId),
    })
    return { protocol }
  },
})
