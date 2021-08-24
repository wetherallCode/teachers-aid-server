import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { CourseInfo } from '.'

export const AddAssociatedCourseIdPayload = objectType({
  name: 'AddAssociatedCourseIdPayload',
  definition(t) {
    t.list.field('courseInfo', { type: CourseInfo })
  },
})

export const AddAssociatedCourseId = mutationField('addAssociatedCourseId', {
  type: AddAssociatedCourseIdPayload,

  async resolve(_, __, { courseData }) {
    let courses: NexusGenRootTypes['CourseInfo'][] = await courseData
      .find({ startsAt: { $exists: true } })
      .toArray()
    for (let course of courses) {
      const count = await courseData.updateOne(
        { 'course._id': course.course._id },
        { $set: { associatedCourseId: course.course._id } }
      )
    }
    courses = await courseData.find({ startsAt: { $exists: true } }).toArray()
    return { courseInfo: courses }
  },
})
