import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Lesson } from '.'
import { ObjectId } from 'mongodb'

export const FindLessonByIdInput = inputObjectType({
  name: 'FindLessonByIdInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const FindLessonByIdPayload = objectType({
  name: 'FindLessonByIdPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const FindLessonById = queryField('findLessonById', {
  type: FindLessonByIdPayload,
  args: { input: arg({ type: FindLessonByIdInput, required: true }) },
  async resolve(_, { input: { _id } }, { lessonData }) {
    const lesson = await lessonData.findOne({ _id: new ObjectId(_id) })
    return { lesson }
  },
})
