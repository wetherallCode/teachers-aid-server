import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const RemoveCourseInput = inputObjectType({
  name: 'RemoveCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const RemoveCoursePayload = objectType({
  name: 'RemoveCoursePayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveCourse = mutationField('removeCourse', {
  type: RemoveCoursePayload,
  args: { input: arg({ type: RemoveCourseInput, required: true }) },
  async resolve(_, { input: { courseId } }, { courseData }) {
    const { deletedCount } = await courseData.deleteOne({
      _id: new ObjectId(courseId),
    })

    if (deletedCount === 1) {
      return { removed: true }
    } else return { removed: false }
  },
})
