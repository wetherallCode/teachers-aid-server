import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson } from '..'
import { ObjectId } from 'mongodb'

export const ControlCoolDownInput = inputObjectType({
  name: 'ControlCoolDownInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.boolean('isActive', { required: true })
  },
})

export const ControlCoolDownPayload = objectType({
  name: 'ControlCoolDownPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const ControlCoolDown = mutationField('controlCoolDown', {
  type: ControlCoolDownPayload,
  args: { input: arg({ type: ControlCoolDownInput, required: true }) },
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
            'afterActivity.$.isActive': isActive,
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
