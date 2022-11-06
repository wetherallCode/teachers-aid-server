import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteQuizzesByDateInput = inputObjectType({
  name: 'DeleteQuizzesByDateInput',
  definition(t) {
    t.string('assignedDate')
  },
})

export const DeleteQuizzesByDatePayload = objectType({
  name: 'DeleteQuizzesByDatePayload',
  definition(t) {
    t.boolean('deleted')
  },
})

export const DeleteQuizzesByDate = mutationField('deleteQuizzesByDate', {
  type: DeleteQuizzesByDatePayload,
  args: { input: arg({ type: DeleteQuizzesByDateInput, required: true }) },
  async resolve(_, { input: { assignedDate } }, { assignmentData }) {
    const quizCount = await assignmentData
      .find({
        assignedDate,
        workingDraft: { $exists: false },
        quizzableSections: { $exists: true },
      })
      .toArray()
    const { deletedCount } = await assignmentData.deleteMany({
      assignedDate,
      workingDraft: { $exists: false },
      quizzableSections: { $exists: true },
    })

    return { deleted: quizCount === deletedCount ? true : false }
  },
})
