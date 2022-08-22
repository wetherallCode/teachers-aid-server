import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { Course } from '.'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const CreateCourseInput = inputObjectType({
  name: 'CreateCourseInput',
  definition(t) {
    t.string('name', { required: true })
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
  async resolve(_, { input: { name } }, { courseData }) {
    const courseCheck = await courseData.findOne({ name })

    if (!courseCheck) {
      const newCourse: NexusGenRootTypes['Course'] = {
        name,
      }

      const { insertedId } = await courseData.insertOne(newCourse)
      newCourse._id = insertedId
      return { course: newCourse }
    } else throw new Error('Course Name Taken')
  },
})
