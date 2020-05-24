import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Lesson } from '.'

export const FindLessonByCourseAndDateInput = inputObjectType({
  name: 'FindLessonByCourseAndDateInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.date('lessonDate', { required: true })
  },
})

export const FindLessonByCourseAndDatePayload = objectType({
  name: 'FindLessonByCourseAndDatePayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const FindLessonByCourseAndDate = queryField(
  'findLessonByCourseAndDate',
  {
    type: FindLessonByCourseAndDatePayload,
    args: {
      input: arg({ type: FindLessonByCourseAndDateInput, required: true }),
    },
    async resolve(_, { input: { courseId, lessonDate } }, { lessonData }) {
      const lesson = await lessonData.findOne({
        'assignedCourse._id': courseId,
        assignedDate: lessonDate,
      })
      return { lesson }
    },
  }
)
