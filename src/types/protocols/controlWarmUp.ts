import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson } from '..'
import { ObjectId } from 'mongodb'

export const ControlWarmUpInput = inputObjectType({
  name: 'ControlWarmUpInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.boolean('isActive', { required: true })
  },
})

export const ControlWarmUpPayload = objectType({
  name: 'ControlWarmUpPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const ControlWarmUp = mutationField('controlWarmUp', {
  type: ControlWarmUpPayload,
  args: { input: arg({ type: ControlWarmUpInput, required: true }) },
  async resolve(_, { input: { lessonId, isActive } }, { lessonData }) {
    const lessonCheck = await lessonData.findOne({
      _id: new ObjectId(lessonId),
    })

    if (lessonCheck) {
      await lessonData.updateOne(
        {
          _id: new ObjectId(lessonId),
        },
        {
          $set: {
            'beforeActivity.isActive': isActive,
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
