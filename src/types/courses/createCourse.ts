import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { Course } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/practice-api-typegen'

export const CreateCourseInput = inputObjectType({
  name: 'CreateCourseInput',
  definition(t) {
    t.string('period', { required: true })
    t.string('taughtBy', { required: true })
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
  async resolve(_, { input: { period, taughtBy } }, { userData, courseData }) {
    const teacher = await userData.findOne({ userName: taughtBy })
    const newCourse: NexusGenRootTypes['Course'] = {
      hasTeacher: teacher,
      period,
      hasStudents: [],
    }

    const { insertedId } = await courseData.insertOne(newCourse)
    newCourse._id = insertedId
    return { course: newCourse }
  },
})
