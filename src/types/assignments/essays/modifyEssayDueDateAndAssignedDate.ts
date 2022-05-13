import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ModifyEssayDueDateAndAssignedDateInput = inputObjectType({
	name: 'ModifyEssayDueDateAndAssignedDateInput',
	definition(t) {
		t.string('originalAssignedDate')
		t.string('newAssignedDate')
		t.string('newDueDate')
	},
})

export const ModifyEssayDueDateAndAssignedDatePayload = objectType({
	name: 'ModifyEssayDueDateAndAssignedDatePayload',
	definition(t) {
		t.boolean('updated')
	},
})

export const ModifyEssayDueDateAndAssignedDate = mutationField(
	'modifyEssayDueDateAndAssignedDate',
	{
		type: ModifyEssayDueDateAndAssignedDatePayload,
		args: { input: arg({ type: ModifyEssayDueDateAndAssignedDateInput, required: true }) },
		async resolve(
			_,
			{ input: { originalAssignedDate, newAssignedDate, newDueDate } },
			{ assignmentData }
		) {
			const essays = await assignmentData
				.find({ workingDraft: { $exists: true }, assignedDate: originalAssignedDate })
				.toArray()

			const { modifiedCount } = await assignmentData.updateMany(
				{
					workingDraft: { $exists: true },
					assignedDate: originalAssignedDate,
				},
				{ $set: { assignedDate: newAssignedDate, dueDate: newDueDate } }
			)
			return { updated: essays.length === modifiedCount ? true : false }
		},
	}
)
