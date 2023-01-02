import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { Protocol, ProtocolAssessmentEnum } from '.'
import { MarkingPeriod, MarkingPeriodEnum } from '../general'

export const AssessIndividualProtocolsInput = inputObjectType({
  name: 'AssessIndividualProtocolsInput',
  definition(t) {
    t.id('protocolId', { required: true })
    t.field('markingPeriod', { required: true, type: MarkingPeriodEnum })
    t.field('assessment', { type: ProtocolAssessmentEnum, nullable: true })
    t.float('responsibilityPoints', { required: true })
  },
})

export const AssessIndividualProtocolsPayload = objectType({
  name: 'AssessIndividualProtocolsPayload',
  definition(t) {
    t.field('protocol', { type: Protocol })
  },
})

export const AssessIndividualProtocols = mutationField(
  'assessIndividualProtocols',
  {
    type: AssessIndividualProtocolsPayload,
    args: {
      input: arg({ type: AssessIndividualProtocolsInput, required: true }),
    },
    async resolve(
      _,
      {
        input: { protocolId, markingPeriod, assessment, responsibilityPoints },
      },
      { protocolData, studentData }
    ) {
      const protocol: NexusGenRootTypes['Protocol'] =
        await protocolData.findOne({
          _id: new ObjectId(protocolId),
        })
      if (protocol) {
        protocolData.updateOne(
          {
            _id: new ObjectId(protocolId),
          },
          {
            $set: {
              completed: true,
              assessment,
            },
          }
        )

        if (protocol.assessment === null && assessment !== null) {
          studentData.updateOne(
            {
              'student._id': new ObjectId(protocol.student._id!),
              markingPeriod,
              responsibilityPoints: { $exists: true },
              behavior: { $exists: false },
            },
            { $inc: { responsibilityPoints } }
          )
        }

        if (assessment === null) {
          studentData.updateOne(
            {
              'student._id': new ObjectId(protocol.student._id!),
              markingPeriod,
              responsibilityPoints: { $exists: true },
              behavior: { $exists: false },
            },
            { $inc: { responsibilityPoints: -responsibilityPoints } }
          )
        }
        return { protocol }
      } else throw new Error('Protocol does not exist')
    },
  }
)
