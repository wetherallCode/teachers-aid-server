import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteReadingGuideByDateInput = inputObjectType({
  name: 'DeleteReadingGuideByDateInput',
  definition(t) {
    t.string('assignedDate', { required: true })
  },
})

export const DeleteReadingGuideByDatePayload = objectType({
  name: 'DeleteReadingGuideByDatePayload',
  definition(t) {
    t.int('deletedCount')
  },
})

export const DeleteReadingGuideByDate = mutationField(
  'deleteReadingGuideByDate',
  {
    type: DeleteReadingGuideByDatePayload,
    args: {
      input: arg({ type: DeleteReadingGuideByDateInput, required: true }),
    },
    async resolve(_, { input: { assignedDate } }, { assignmentData }) {
      const { deletedCount } = await assignmentData.deleteMany({
        assignedDate,
        quizzableSections: { $exists: false },
        workingDraft: { $exists: false },
        textAnalysisCompletion: { $exists: false },
      })

      console.log(deletedCount)
      return { deletedCount }
    },
  },
)
