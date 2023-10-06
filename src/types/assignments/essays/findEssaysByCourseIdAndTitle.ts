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
      const essays = await assignmentData
        .find({
          'hasOwner.inCourses._id': new ObjectId(courseId),
          'readings.readingSections': essayTitle,
          workingDraft: { $exists: true },
        })
        .toArray()
      console.log(
        essayTitle === 'The Articles of Confederation - Popular Politics',
        essayTitle
      )
      return { essays }
    },
  }
)
// "hasOwner.inCourses._id": ObjectId('613269a4fea6ec23e4989c82'), "readings.readingSections":"The Articles of Confederation - Popular Politics", workingDraft: {$exists:true}
