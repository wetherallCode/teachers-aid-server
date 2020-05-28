import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Lesson } from '.'
import { ObjectId } from 'mongodb'

export const FindLessonsByUnitInput = inputObjectType({
  name: 'FindLessonsByUnitInput',
  definition(t) {
    t.id('unitId', { required: true })
  },
})

export const FindLessonsByUnitPayload = objectType({
  name: 'FindLessonsByUnitPayload',
  definition(t) {
    t.list.field('lessons', { type: Lesson })
  },
})

export const FindLessonsByUnit = queryField('findLessonsByUnit', {
  type: FindLessonsByUnitPayload,
  args: { input: arg({ type: FindLessonsByUnitInput, required: true }) },
  async resolve(_, { input: { unitId } }, { lessonData }) {
    const lessons = await lessonData
      .find({ 'inUnit._id': new ObjectId(unitId) })
      .toArray()
    return { lessons }
  },
})
