import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Student } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const FindStudentsByCourseInput = inputObjectType({
  name: 'FindStudentsByCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindStudentsByCoursePayload = objectType({
  name: 'FindStudentsByCoursePayload',
  definition(t) {
    t.list.field('students', { type: Student })
  },
})

export const FindStudentsByCourse = queryField('findStudentsByCourse', {
  type: FindStudentsByCoursePayload,
  args: { input: arg({ type: FindStudentsByCourseInput, required: true }) },
  async resolve(_, { input: { courseId } }, { userData }) {
    const students: NexusGenRootTypes['Student'][] = await userData
      .find({ 'inCourses._id': new ObjectId(courseId) })
      .toArray()

    return { students }
  },
})
