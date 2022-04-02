import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol, DiscussionTypesEnum, ProtocolAssessmentEnum } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ProtocolActivityTypes } from '..'
import { MarkingPeriodEnum } from '../general'

export const AssessStudentProtocolInput = inputObjectType({
  name: 'AssessStudentProtocolInput',
  definition(t) {
    // t.id('protocolId', { required: true })
    t.string('task', { required: true })
    t.field('protocolActivityType', {
      type: ProtocolActivityTypes,
      required: true,
    })
    t.string('assignedDate')
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.list.id('partnerIds')
    t.id('studentId', { required: true })
    t.field('discussionLevel', { type: DiscussionTypesEnum })
    t.field('assessment', { type: ProtocolAssessmentEnum })
    t.float('responsibilityPoints', { required: true })
  },
})

export const AssessStudentProtocolPayload = objectType({
  name: 'AssessStudentProtocolPayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const AssessStudentProtocol = mutationField('assessStudentProtocol', {
  type: AssessStudentProtocolPayload,
  args: { input: arg({ type: AssessStudentProtocolInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        task,
        assignedDate,
        markingPeriod,
        protocolActivityType,
        partnerIds,
        discussionLevel,
        assessment,
        studentId,
        responsibilityPoints,
      },
    },
    { protocolData, userData, studentData }
  ) {
    const protocols: NexusGenRootTypes['Protocol'][] = []

    const groupIds =
      partnerIds!.length > 0 ? [...partnerIds!, studentId] : [studentId]

    for (const _id of groupIds!) {
      if (protocolActivityType !== 'INDIVIDUAL') {
        const partnerToExclude = groupIds!.findIndex((i: string) => i === _id)

        const partners = [
          ...groupIds!.slice(0, partnerToExclude),
          ...groupIds!.slice(partnerToExclude + 1),
        ]

        const partnerObjects: NexusGenRootTypes['Student'][] = []

        for (const partnerId of partners) {
          const partner = await userData.findOne({
            _id: new ObjectId(partnerId),
          })
          partnerObjects.push(partner)
        }

        await protocolData.updateOne(
          {
            'student._id': new ObjectId(_id),
            task,
            assignedDate,
          },
          {
            $set: { partners: partnerObjects, discussionLevel, assessment },
          }
        )
        const protocol: NexusGenRootTypes['Protocol'] =
          await protocolData.findOne({
            'student._id': new ObjectId(_id),
            task,
            assignedDate,
          })

        protocols.push(protocol)
      } else {
        const protocolToCheck: NexusGenRootTypes['Protocol'] =
          await protocolData.findOne({
            'student._id': new ObjectId(_id),
            task,
            assignedDate,
            protocolActivityType,
          })

        const protocolScore =
          assessment === 'WORKED_WELL'
            ? responsibilityPoints * 0.67
            : assessment === 'WORKED_VERY_WELL'
            ? responsibilityPoints
            : assessment === 'REFUSED_TO_WORK'
            ? 0
            : responsibilityPoints * 0.33

        const scoringAlgorithm =
          protocolToCheck.assessment === assessment
            ? 0
            : -protocolToCheck.lastScore + protocolScore

        await protocolData.updateOne(
          {
            'student._id': new ObjectId(_id),
            task,
            assignedDate,
            protocolActivityType,
          },
          {
            $set: { assessment, lastScore: protocolScore },
          }
        )
        await studentData.updateOne(
          {
            'student._id': new ObjectId(studentId),
            markingPeriod: markingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: {
              responsibilityPoints: scoringAlgorithm,
            },
          }
        )
        const protocol = await protocolData.findOne({
          'student._id': new ObjectId(_id),
          task,
          assignedDate,
        })
        protocols.push(protocol)
      }
    }

    return { protocols }
  },
})
