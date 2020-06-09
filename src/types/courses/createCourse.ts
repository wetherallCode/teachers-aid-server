import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { Course } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { CourseTypeEnum } from './course'

export const CreateCourseInput = inputObjectType({
  name: 'CreateCourseInput',
  definition(t) {
    t.string('name', { required: true })
    t.field('courseType', { type: CourseTypeEnum, required: true })
  },
})

export const CreateCoursePayload = objectType({
  name: 'CreateCoursePayload',
  definition(t) {
    t.field('course', { type: Course })
  },
})

export const CreateCourse = mutationField('createCourse', {
  type: CreateCoursePayload,
  args: { input: arg({ type: CreateCourseInput, required: true }) },
  async resolve(_, { input: { name, courseType } }, { courseData }) {
    const newCourse: NexusGenRootTypes['Course'] = {
      courseType,
      name,
    }

    const { insertedId } = await courseData.insertOne(newCourse)
    newCourse._id = insertedId
    return { course: newCourse }
  },
})
