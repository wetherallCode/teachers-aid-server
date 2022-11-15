import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ModifyLessonsByAssignedDayInput = inputObjectType({
  name: 'ModifyLessonsByAssignedDayInput',
  definition(t) {
    t.string('day', { required: true })
  },
})

export const ModifyLessonsByAssignedDayPayload = objectType({
  name: 'ModifyLessonsByAssignedDayPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyLessonsByAssignedDay = mutationField(
  'modifyLessonsByAssignedDay',
  {
    type: ModifyLessonsByAssignedDayPayload,
    args: {
      input: arg({ type: ModifyLessonsByAssignedDayInput, required: true }),
    },
    async resolve(_, { input: { day } }, { lessonData }) {
      const lessons = await lessonData.find({ assignedDate: day }).toArray()
      const { modifiedCount } = lessonData.updateMany(
        { assignedDate: day },
        { $set: { protocolCount: 0 } }
      )
      return { modified: lessons.length === modifiedCount ? true : false }
    },
  }
)
