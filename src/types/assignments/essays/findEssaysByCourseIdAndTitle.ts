import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'
import { ObjectId } from 'mongodb'

export const FindEssaysByCourseIdAndTitleInput = inputObjectType({
  name: 'FindEssaysByCourseIdAndTitleInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('essayTitle', { required: true })
  },
})

export const FindEssaysByCourseIdAndTitlePayload = objectType({
  name: 'FindEssaysByCourseIdAndTitlePayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const FindEssaysByCourseIdAndTitle = queryField(
  'findEssaysByCourseIdAndTitle',
  {
    type: FindEssaysByCourseIdAndTitlePayload,
    args: {
      input: arg({ type: FindEssaysByCourseIdAndTitleInput, required: true }),
    },
    async resolve(_, { input: { courseId, essayTitle } }, { assignmentData }) {
      const essays = assignmentData.find({
        'hasOwner.inCourses._id': new ObjectId(courseId),
        'readings.readingSections': essayTitle,
        workingDraft: { $exists: true },
      })
      return { essays }
    },
  }
)
