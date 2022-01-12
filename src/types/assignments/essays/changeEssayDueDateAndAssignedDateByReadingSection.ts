import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ChangeEssayDueDateAndAssignedDateByReadingSectionInput =
  inputObjectType({
    name: 'ChangeEssayDueDateAndAssignedDateByReadingSectionInput',
    definition(t) {
      t.string('readingSections', { required: true })
      t.string('newDueDate')
      t.string('newAssignedDate')
    },
  })

export const ChangeEssayDueDateAndAssignedDateByReadingSectionPayload =
  objectType({
    name: 'ChangeEssayDueDateAndAssignedDateByReadingSectionPayload',
    definition(t) {
      t.boolean('updated')
    },
  })

export const ChangeEssayDueDateAndAssignedDateByReadingSection = mutationField(
  'changeEssayDueDateAndAssignedDateByReadingSection',
  {
    type: ChangeEssayDueDateAndAssignedDateByReadingSectionPayload,
    args: {
      input: arg({
        type: ChangeEssayDueDateAndAssignedDateByReadingSectionInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { readingSections, newDueDate, newAssignedDate } },
      { assignmentData }
    ) {
      const essays = await assignmentData
        .find({
          workingDraft: { $exists: true },
          'readings.readingSections': readingSections,
        })
        .toArray()
      const { modifiedCount } = await assignmentData.updateMany(
        {
          workingDraft: { $exists: true },
          'readings.readingSections': readingSections,
        },
        { $set: { assignedDate: newAssignedDate, dueDate: newDueDate } }
      )
      console.log(essays.length, modifiedCount)
      return { updated: essays.length === modifiedCount ? true : false }
    },
  }
)
