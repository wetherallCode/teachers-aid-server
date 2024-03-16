import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { CourseInfo } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const FindCourseInfoByCourseIdInput = inputObjectType({
  name: 'FindCourseInfoByCourseIdInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindCourseInfoByCourseIdPayload = objectType({
  name: 'FindCourseInfoByCourseIdPayload',
  definition(t) {
    t.field('courseInfo', { type: CourseInfo })
  },
})

export const FindCourseInfoByCourseId = queryField('findCourseInfoByCourseId', {
  type: FindCourseInfoByCourseIdPayload,
  args: { input: arg({ type: FindCourseInfoByCourseIdInput, required: true }) },
  async resolve(_, { input: { courseId } }, { courseData }) {
    const course: NexusGenRootTypes['CourseInfo'] = await courseData.findOne({
      'course._id': new ObjectId(courseId),
    })
    if (course) {
      console.log(course)
      return { courseInfo: course }
    } else throw new Error('Course does not exist.')
  },
})
