import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol, DiscussionTypesEnum } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import {
  AcademicOutcomeTypes,
  ProtocolActivityTypes,
  MarkingPeriodEnum,
} from '..'
import { ObjectId } from 'mongodb'

export const CreateProtocolInput = inputObjectType({
  name: 'CreateProtocolInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.field('academicOutcomeType', {
      type: AcademicOutcomeTypes,
      required: true,
    })
    t.field('protocolActivityType', {
      type: ProtocolActivityTypes,
      required: true,
    })
    t.field('academicOutcomeType', {
      type: AcademicOutcomeTypes,
      required: true,
    })
    t.string('task', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const CreateProtocolPayload = objectType({
  name: 'CreateProtocolPayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const CreateProtocol = mutationField('createProtocol', {
  type: CreateProtocolPayload,
  args: { input: arg({ type: CreateProtocolInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        studentIds,
        protocolActivityType,
        academicOutcomeType,
        task,
        markingPeriod,
      },
    },
    { protocolData, userData }
  ) {
    const protocols: NexusGenRootTypes['Protocol'][] = []

    for (const studentId of studentIds) {
      const student = await userData.findOne({ _id: new ObjectId(studentId) })
      const protocolCheck = await protocolData.findOne({
        'student._id': new ObjectId(studentId),

        task,
      })
      if (!protocolCheck) {
        const protocol: NexusGenRootTypes['Protocol'] = {
          academicOutcomeType,
          assignedDate: new Date().toLocaleDateString(),
          isActive: true,
          markingPeriod,
          protocolActivityType,
          completed: false,
          startTime: new Date().toLocaleTimeString(),
          student,
          task,
        }
        const { insertedId } = await protocolData.insertOne(protocol)
        protocol._id = insertedId
        protocols.push(protocol)
      }
    }
    return { protocols }
  },
})
