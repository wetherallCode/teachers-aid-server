import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const ToggleReadingGuideCheckInput = inputObjectType({
  name: 'ToggleReadingGuideCheckInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const ToggleReadingGuideCheckPayload = objectType({
  name: 'ToggleReadingGuideCheckPayload',
  definition(t) {
    t.boolean('toggled')
  },
})

export const ToggleReadingGuideCheck = mutationField(
  'toggleReadingGuideCheck',
  {
    type: ToggleReadingGuideCheckPayload,
    args: {
      input: arg({ type: ToggleReadingGuideCheckInput, required: true }),
    },
    async resolve(_, { input: { courseId } }, { courseData }) {
      const courseToFind: NexusGenRootTypes['CourseInfo'] =
        await courseData.findOne({
          'course._id': new ObjectId(courseId),
        })
      const { modifiedCount } = await courseData.updateOne(
        { 'course._id': new ObjectId(courseId) },
        {
          $set: {
            checkReadingGuides: !courseToFind.checkReadingGuides,
          },
        }
      )
      return { toggled: modifiedCount === 1 ? true : false }
    },
  }
)
