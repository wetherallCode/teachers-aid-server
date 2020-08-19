import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson } from '.'
import { ObjectId } from 'mongodb'
import { DynamicLessonEnums } from './dynamicLesson'

export const UpdateDynamicLessonInput = inputObjectType({
  name: 'UpdateDynamicLessonInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.field('dynamicLessonUpdate', { type: DynamicLessonEnums, required: true })
  },
})

export const UpdateDynamicLessonPayload = objectType({
  name: 'UpdateDynamicLessonPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const UpdateDynamicLesson = mutationField('UpdateDynamicLesson', {
  type: UpdateDynamicLessonPayload,
  args: { input: arg({ type: UpdateDynamicLessonInput, required: true }) },
  async resolve(
    _,
    { input: { lessonId, dynamicLessonUpdate } },
    { lessonData }
  ) {
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
            dynamicLesson: dynamicLessonUpdate,
          },
        }
      )

      const lesson = await lessonData.findOne({
        _id: new ObjectId(lessonId),
      })

      return { lesson }
    } else throw new Error('Lesson does not exist.')
  },
})
