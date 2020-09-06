import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, Protocol } from '../lessons'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const StartProtocolInput = inputObjectType({
  name: 'StartProtocolInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.string('task', { required: true })
    t.boolean('isActive', { required: true })
  },
})

export const StartProtocolPayload = objectType({
  name: 'StartProtocolPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const StartProtocol = mutationField('startProtocol', {
  type: StartProtocolPayload,
  args: { input: arg({ type: StartProtocolInput, required: true }) },
  async resolve(_, { input: { lessonId, task, isActive } }, { lessonData }) {
    const lessonCheck = await lessonData.findOne({
      _id: new ObjectId(lessonId),
    })

    if (lessonCheck) {
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
      }
    } else throw new Error('Lesson does not exist.')
  },
})
