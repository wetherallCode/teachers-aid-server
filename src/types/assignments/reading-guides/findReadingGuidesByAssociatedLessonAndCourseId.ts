import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ReadingGuide } from '.'
import { ObjectId } from 'mongodb'

export const FindReadingGuidesByAssociatedLessonAndCourseIdInput = inputObjectType(
  {
    name: 'FindReadingGuidesByAssociatedLessonAndCourseIdInput',
    definition(t) {
      t.id('lessonId', { required: true })
      t.id('courseId', { required: true })
    },
  }
)

export const FindReadingGuidesByAssociatedLessonAndCourseIdPayload = objectType(
  {
    name: 'FindReadingGuidesByAssociatedLessonAndCourseIdPayload',
    definition(t) {
      t.list.field('readingGuides', { type: ReadingGuide })
    },
  }
)

export const FindReadingGuidesByAssociatedLessonAndCourseId = queryField(
  'findReadingGuidesByAssociatedLessonAndCourseId',
  {
    type: FindReadingGuidesByAssociatedLessonAndCourseIdPayload,
    args: {
      input: arg({
        type: FindReadingGuidesByAssociatedLessonAndCourseIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { lessonId, courseId } }, { assignmentData }) {
      const readingGuides = await assignmentData
        .find({
          associatedLessonId: lessonId,
          'hasOwner.inCourses._id': new ObjectId(courseId),
          completed: { $exists: true },
        })
        .toArray()

      return { readingGuides }
    },
  }
)
