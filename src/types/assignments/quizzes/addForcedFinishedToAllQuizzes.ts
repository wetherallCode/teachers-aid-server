import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const AddForcedFinishedToAllQuizzesPayload = objectType({
  name: 'AddForcedFinishedToAllQuizzesPayload',
  definition(t) {
    t.boolean('added')
  },
})

export const AddForcedFinishedToAllQuizzes = mutationField(
  'addForcedFinishedToAllQuizzes',
  {
    type: AddForcedFinishedToAllQuizzesPayload,
    async resolve(_, __, { assignmentData }) {
      await assignmentData.updateMany(
        {
          quizzableSections: { $exists: true },
          // 'hasOwner.inCourses.name': '3rd Period',
          dueDate: '11/17/2021',
        },
        {
          $set: {
            // assigned: false,
            // startedQuiz: false,
            assignedDate: '11/18/2021',
          },
        }
      )
      return { added: true }
    },
  }
)
