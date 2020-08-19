import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'
import { ObjectId } from 'mongodb'

export const FindEssaysByAssociatedLessonIdAndCourseIdInput = inputObjectType({
  name: 'FindEssaysByAssociatedLessonIdAndCourseIdInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.id('courseId', { required: true })
  },
})

export const FindEssaysByAssociatedLessonIdAndCourseIdPayload = objectType({
  name: 'FindEssaysByAssociatedLessonIdAndCourseIdPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const FindEssaysByAssociatedLessonIdAndCourseId = queryField(
  'findEssaysByAssociatedLessonIdAndCourseId',
  {
    type: FindEssaysByAssociatedLessonIdAndCourseIdPayload,
    args: {
      input: arg({
        type: FindEssaysByAssociatedLessonIdAndCourseIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { lessonId, courseId } }, { assignmentData }) {
      const essays = await assignmentData
        .find({
          associatedLessonId: lessonId,
          'hasOwner.inCourses._id': new ObjectId(courseId),
          workingDraft: { $exists: true },
        })
        .toArray()

      return { essays }
    },
  }
)
