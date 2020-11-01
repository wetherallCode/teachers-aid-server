import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'

export const FindEssaysByAssociatedLessonIdInput = inputObjectType({
  name: 'FindEssaysByAssociatedLessonIdInput',
  definition(t) {
    t.id('associatedLessonId', { required: true })
  },
})

export const FindEssaysByAssociatedLessonIdPayload = objectType({
  name: 'FindEssaysByAssociatedLessonIdPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const FindEssaysByAssociatedLessonId = queryField(
  'findEssaysByAssociatedLessonId',
  {
    type: FindEssaysByAssociatedLessonIdPayload,
    args: {
      input: arg({ type: FindEssaysByAssociatedLessonIdInput, required: true }),
    },
    async resolve(_, { input: { associatedLessonId } }, { assignmentData }) {
      const essays = await assignmentData
        .find({
          associatedLessonId,
          workingDraft: { $exists: true },
        })
        .toArray()
      return { essays }
    },
  }
)
