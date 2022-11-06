import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { Course } from '.'

export const FindCourseByIdInput = inputObjectType({
  name: 'FindCourseByIdInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindCourseByIdPayload = objectType({
  name: 'FindCourseByIdPayload',
  definition(t) {
    t.field('course', { type: Course })
  },
})

export const FindCourseById = queryField('findCourseById', {
  type: FindCourseByIdPayload,
  args: { input: arg({ type: FindCourseByIdInput, required: true }) },
  async resolve(_, { input: { courseId } }, { courseData }) {
    const course: NexusGenRootTypes['Course'] = await courseData.findOne({
      _id: new ObjectId(courseId),
    })

    return { course }
  },
})
