import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { Lesson } from '.'

export const FindLessonsByAssignedDateInput = inputObjectType({
  name: 'FindLessonsByAssignedDateInput',
  definition(t) {
    t.string('assignedDate', { required: true })
  },
})

export const FindLessonsByAssignedDatePayload = objectType({
  name: 'FindLessonsByAssignedDatePayload',
  definition(t) {
    t.list.field('lessons', { type: Lesson, nullable: true })
  },
})

export const FindLessonsByAssignedDate = queryField(
  'findLessonsByAssignedDate',
  {
    type: FindLessonsByAssignedDatePayload,
    args: {
      input: arg({ type: FindLessonsByAssignedDateInput, required: true }),
    },
    async resolve(_, { input: { assignedDate } }, { lessonData }) {
      const lessons: NexusGenRootTypes['Lesson'][] = await lessonData
        .find({ assignedDate })
        .toArray()

      return { lessons: lessons }
    },
  }
)
