import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ChangeQuizDueDateAndAssignedDateByReadingSectionInput =
  inputObjectType({
    name: 'ChangeQuizDueDateAndAssignedDateByReadingSectionInput',
    definition(t) {
      t.string('readingSections', { required: true })
      t.string('newDueDate')
      t.string('newAssignedDate')
    },
  })

export const ChangeQuizDueDateAndAssignedDateByReadingSectionPayload =
  objectType({
    name: 'ChangeQuizDueDateAndAssignedDateByReadingSectionPayload',
    definition(t) {
      t.boolean('updated')
    },
  })

export const ChangeQuizDueDateAndAssignedDateByReadingSection = mutationField(
  'changeQuizDueDateAndAssignedDateByReadingSection',
  {
    type: ChangeQuizDueDateAndAssignedDateByReadingSectionPayload,
    args: {
      input: arg({
        type: ChangeQuizDueDateAndAssignedDateByReadingSectionInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { readingSections, newDueDate, newAssignedDate } },
      { assignmentData }
    ) {
      const quizzes = await assignmentData
        .find({
          workingDraft: { $exists: false },
          quizzableSections: { $exists: true },
          'readings.readingSections': readingSections,
        })
        .toArray()
      const { modifiedCount } = await assignmentData.updateMany(
        {
          workingDraft: { $exists: false },
          quizzableSections: { $exists: true },
          'readings.readingSections': readingSections,
        },
        { $set: { assignedDate: newAssignedDate, dueDate: newDueDate } }
      )
      console.log(quizzes.length, modifiedCount)
      return { updated: quizzes.length === modifiedCount ? true : false }
    },
  }
)
