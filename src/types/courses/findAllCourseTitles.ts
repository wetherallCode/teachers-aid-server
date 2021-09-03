import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Course } from '.'

export const FindAllCourseTitlesPayload = objectType({
  name: 'FindAllCourseTitlesPayload',
  definition(t) {
    t.list.field('courses', { type: Course })
  },
})

export const FindAllCourseTitles = queryField('findAllCourseTitles', {
  type: FindAllCourseTitlesPayload,
  // args: { input: arg({ type: FindAllCourseTitlesInput, required: true }) },
  async resolve(_, __, { courseData }) {
    const courses = await courseData.find({ name: { $exists: true } }).toArray()
    return { courses }
  },
})
