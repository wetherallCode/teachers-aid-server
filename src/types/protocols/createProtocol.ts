import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol, DiscussionTypesEnum } from '.'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import {
  AcademicOutcomeTypes,
  ProtocolActivityTypes,
  MarkingPeriodEnum,
} from '..'
import { ObjectId } from 'mongodb'
import { timeAFunction } from '../../utilities'

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
    { protocolData, userData, studentData }
  ) {
    const protocols: NexusGenRootTypes['Protocol'][] = []
    const startTime = new Date().toISOString()
    for (const studentId of studentIds) {
      const student: NexusGenRootTypes['Student'] = await userData.findOne({
        _id: new ObjectId(studentId),
      })
      const protocolCheck: NexusGenRootTypes['Protocol'] =
        await protocolData.findOne({
          'student._id': new ObjectId(studentId),

          task,
        })
      // protocolCheck.protocolActivityType==='SMALL_GROUP'
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
          lastScore: 2,
          assessment: 'WORKED_WELL',
          discussionLevel:
            protocolActivityType === 'SMALL_GROUP' ? 'DISCUSSED' : null,
        }
        const { insertedId } = await protocolData.insertOne(protocol)
        protocol._id = insertedId
        protocols.push(protocol)

        await studentData.updateOne(
          {
            'student._id': new ObjectId(student._id!),
            markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          { $inc: { responsibilityPoints: 2 } }
        )
      }
    }
    const endTime = new Date().toISOString()
    console.log(timeAFunction(startTime, endTime))
    return { protocols }
  },
})
