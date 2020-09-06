import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, Protocol } from '../lessons'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const UpdateLessonProtocolInput = inputObjectType({
  name: 'UpdateLessonProtocolInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.string('task', { required: true })
    t.boolean('isActive', { required: true })
    t.date('assignedDate', { required: true })
    t.list.id('studentIds', { required: true })
  },
})

export const UpdateLessonProtocolPayload = objectType({
  name: 'UpdateProtocolPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
    t.list.field('protocols', { type: Protocol })
  },
})

export const UpdateLessonProtocol = mutationField('updateLessonProtocol', {
  type: UpdateLessonProtocolPayload,
  args: { input: arg({ type: UpdateLessonProtocolInput, required: true }) },
  async resolve(
    _,
    { input: { lessonId, task, isActive, assignedDate, studentIds } },
    { lessonData, protocolData }
  ) {
    const lessonCheck = await lessonData.findOne({
      _id: new ObjectId(lessonId),
    })

    if (lessonCheck) {
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
              // endTime: new Date().toLocaleTimeString(),
              isActive: isActive,
              // completed: true,
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
      await lessonData.updateOne(
        {
          _id: new ObjectId(lessonId),
          duringActivities: { $elemMatch: { task } },
        },
        {
          $set: {
            'duringActivities.$.isActive': isActive,
          },
        }
      )
      return {
        lesson: await lessonData.findOne({
          _id: new ObjectId(lessonId),
        }),
        protocols,
      }
    } else throw new Error('Lesson does not exist.')
  },
})
