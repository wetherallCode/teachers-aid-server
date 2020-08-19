import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol, DiscussionTypesEnum, ProtocolAssessmentEnum } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ProtocolActivityTypes } from '..'

export const AssessStudentProtocolInput = inputObjectType({
  name: 'AssessStudentProtocolInput',
  definition(t) {
    // t.id('protocolId', { required: true })
    t.string('task', { required: true })
    t.field('protocolActivityType', {
      type: ProtocolActivityTypes,
      required: true,
    })
    t.date('assignedDate')
    t.list.id('partnerIds')
    t.id('studentId', { required: true })
    t.field('discussionLevel', { type: DiscussionTypesEnum })
    t.field('assessment', { type: ProtocolAssessmentEnum })
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
        protocolActivityType,
        partnerIds,
        discussionLevel,
        assessment,
        studentId,
      },
    },
    { protocolData, userData }
  ) {
    task
    assignedDate
    // console.log(discussionLevel)
    assessment
    protocolData

    const protocols: NexusGenRootTypes['Protocol'][] = []

    const groupIds =
      partnerIds!.length > 0 ? [...partnerIds!, studentId] : [studentId]

    for (const _id of groupIds!) {
      // console.log(_id)
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
        const protocol: NexusGenRootTypes['Protocol'] = await protocolData.findOne(
          {
            'student._id': new ObjectId(_id),
            task,
            assignedDate,
          }
        )

        protocols.push(protocol)
      } else {
        await protocolData.updateOne(
          {
            'student._id': new ObjectId(_id),
            task,
            assignedDate,
            protocolActivityType,
          },
          {
            $set: { assessment },
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
    // console.log(protocols.length, partnerIds?.length)

    return { protocols }
  },
})
