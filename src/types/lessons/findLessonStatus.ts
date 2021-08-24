import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Lesson } from '.'

export const FindLessonStatusInput = inputObjectType({
  name: 'FindLessonStatusInput',
  definition(t) {
    t.id('lessonId', { required: true })
  },
})

export const FindLessonStatusPayload = objectType({
  name: 'FindLessonStatusPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const FindLessonStatus = queryField('findLessonStatus', {
  type: FindLessonStatusPayload,
  args: { input: arg({ type: FindLessonStatusInput, required: true }) },
  async resolve(_, { input: { lessonId } }, { lessonData }) {
    const lesson = await lessonData.findOne({ _id: new ObjectId(lessonId) })
    return { lesson }
  },
})
