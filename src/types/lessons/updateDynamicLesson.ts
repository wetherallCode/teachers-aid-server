import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson } from '.'
import { ObjectId } from 'mongodb'
import { DynamicLessonEnums } from './dynamicLesson'
import { timeAFunction } from '../../utilities'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

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
    const startTime = new Date().toISOString()
    const lessonCheck: NexusGenRootTypes['Lesson'] = await lessonData.findOne({
      _id: new ObjectId(lessonId),
    })
    if (lessonCheck) {
      if (!lessonCheck.lessonStarted) {
        await lessonData.updateOne(
          { _id: new ObjectId(lessonId) },
          { $set: { lessonStarted: true } }
        )
      }
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
      const endTime = new Date().toISOString()
      console.log(timeAFunction(startTime, endTime))
      return { lesson }
    } else throw new Error('Lesson does not exist.')
  },
})
