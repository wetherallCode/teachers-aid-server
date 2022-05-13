import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { Essay } from './essays'

export const FindSGOEssaysByStudentIdInput = inputObjectType({
	name: 'FindSGOEssaysByStudentIdInput',
	definition(t) {
		t.id('studentId', { required: true })
	},
})

export const FindSGOEssaysByStudentIdPayload = objectType({
	name: 'FindSGOEssaysByStudentIdPayload',
	definition(t) {
		t.list.field('essays', { type: Essay })
	},
})

export const FindSGOEssaysByStudentId = queryField('findSGOEssaysByStudentId', {
	type: FindSGOEssaysByStudentIdPayload,
	args: { input: arg({ type: FindSGOEssaysByStudentIdInput, required: true }) },
	async resolve(_, { input: { studentId } }, { assignmentData, questionData }) {
		const essaysToSearch: NexusGenRootTypes['Essay'][] = await assignmentData
			.find({
				'hasOwner._id': new ObjectId(studentId),
				workingDraft: { $exists: true },
			})
			.toArray()
		const essays = []
		for (const essay of essaysToSearch) {
			const sgoEssayCheck = await questionData.findOne({
				_id: new ObjectId(essay.topic.essayQuestionId),
				sgoQuestion: true,
			})
			if (sgoEssayCheck) essays.push(essay)
		}
		return {
			essays: essays
				.slice()
				.sort((a, b) => Date.parse(a.assignedDate) - Date.parse(b.assignedDate)),
		}
	},
})
