import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const FinishProtocolInput = inputObjectType({
  name: 'FinishProtocolInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.date('assignedDate', { required: true })
    t.string('task', { required: true })
    t.id('lessonId', { required: true })
  },
})

export const FinishProtocolPayload = objectType({
  name: 'FinishProtocolPayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const FinishProtocol = mutationField('finishProtocol', {
  type: FinishProtocolPayload,
  args: { input: arg({ type: FinishProtocolInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, assignedDate, task, lessonId } },
    { protocolData, lessonData }
  ) {
    const protocols: NexusGenRootTypes['Protocol'][] = []
    for (const studentId of studentIds) {
      await protocolData.updateOne(
        {
          'student._id': new ObjectId(studentId),
          assignedDate,
          task,
        },
        {
          $set: {
            endTime: new Date().toLocaleTimeString(),
            isActive: false,
            completed: true,
          },
        }
      )
      const protocol = await protocolData.findOne({
        'student._id': new ObjectId(studentId),
        assignedDate,
        task,
      })
      protocols.push(protocol)
    }
    if (protocols.length === studentIds.length) {
      const { modifiedCount } = await lessonData.updateOne(
        {
          _id: new ObjectId(lessonId),
          //   assignedDate: new Date().toLocaleDateString(),
          duringActivities: { $elemMatch: { task } },
        },
        {
          $set: {
            'duringActivities.$.isActive': false,
            'duringActivities.$.completed': true,
          },
        }
      )
    }
    return { protocols }
  },
})
