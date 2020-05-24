import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Lesson } from '.'
import { ObjectId } from 'mongodb'

export const FindLessonByCourseInput = inputObjectType({
  name: 'FindLessonByCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindLessonByCoursePayload = objectType({
  name: 'FindLessonByCoursePayload',
  definition(t) {
    t.list.field('lessons', { type: Lesson })
  },
})

export const FindLessonByCourse = queryField('findLessonByCourse', {
  type: FindLessonByCoursePayload,
  args: { input: arg({ type: FindLessonByCourseInput, required: true }) },
  async resolve(_, { input: { courseId } }, { lessonData }) {
    const lessons = await lessonData
      .find({ 'assignedCourse._id': new ObjectId(courseId) })
      .toArray()

    return { lessons }
  },
})
