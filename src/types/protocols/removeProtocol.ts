import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Protocol } from '.'
import { ObjectId } from 'mongodb'

export const RemoveProtocolInput = inputObjectType({
  name: 'RemoveProtocolInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.date('assignedDate', { required: true })
    t.string('task', { required: true })
    t.id('lessonId', { required: true })
  },
})

// export const RemovedProtocolResponse = objectType({
//   name: 'RemovedProtocolResponse',
//   definition(t) {
//     t.boolean('removed')
//     t.
//   }
// })

export const RemoveProtocolPayload = objectType({
  name: 'RemoveProtocolPayload',
  definition(t) {
    t.int('deleteCount')
  },
})

export const RemoveProtocol = mutationField('removeProtocol', {
  type: RemoveProtocolPayload,
  args: { input: arg({ type: RemoveProtocolInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, assignedDate, task, lessonId } },
    { protocolData, lessonData }
  ) {
    let deleteCount = 0

    for (const studentId of studentIds) {
      const protocolCheck = await protocolData.findOne({
        'student._id': new ObjectId(studentId),
        assignedDate,
        task,
      })

      if (protocolCheck) {
        const { deletedCount } = await protocolData.deleteOne({
          'student._id': new ObjectId(studentId),
          assignedDate,
          task,
        })

        if (deletedCount === 1) {
          deleteCount = deleteCount + 1
        }
      }
    }

    if (deleteCount === studentIds.length) {
      const { modifiedCount } = await lessonData.updateOne(
        {
          _id: new ObjectId(lessonId),
          //   assignedDate: new Date().toLocaleDateString(),
          duringActivities: { $elemMatch: { task } },
        },
        {
          $set: {
            'duringActivities.$.isActive': false,
            'duringActivities.$.completed': false,
          },
        }
      )
    }
    return { deleteCount }
  },
})
