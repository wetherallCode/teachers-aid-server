import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ModifyLessonDateByOriginalDateInput = inputObjectType({
  name: 'ModifyLessonDateByOriginalDateInput',
  definition(t) {
    t.string('originalDate')
    t.string('newAssignedDate')
  },
})

export const ModifyLessonDateByOriginalDatePayload = objectType({
  name: 'ModifyLessonDateByOriginalDatePayload',
  definition(t) {
    t.boolean('updated')
  },
})

export const ModifyLessonDateByOriginalDate = mutationField(
  'modifyLessonDateByOriginalDate',
  {
    type: ModifyLessonDateByOriginalDatePayload,
    args: {
      input: arg({ type: ModifyLessonDateByOriginalDateInput, required: true }),
    },
    async resolve(
      _,
      { input: { originalDate, newAssignedDate } },
      { lessonData }
    ) {
      const lessons = await lessonData
        .find({ assignedDate: originalDate })
        .toArray()

      const { modifiedCount } = await lessonData.updateMany(
        {
          assignedDate: originalDate,
        },
        { $set: { assignedDate: newAssignedDate } }
      )
      return { updated: lessons.length === modifiedCount ? true : false }
    },
  }
)
