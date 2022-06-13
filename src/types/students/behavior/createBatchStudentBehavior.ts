import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { BehaviorEnum, StudentBehavior } from './studentBehavior'

export const CreateBatchStudentBehaviorInput = inputObjectType({
	name: 'CreateBatchStudentBehaviorInput',
	definition(t) {
		t.list.id('studentIds', { required: true })
		t.field('studentBehaviorType', { type: BehaviorEnum, required: true })
		t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
		t.float('responsibilityPoints', { required: true })
	},
})

export const CreateBatchStudentBehaviorPayload = objectType({
	name: 'CreateBatchStudentBehaviorPayload',
	definition(t) {
		t.list.field('StudentBehaviors', { type: StudentBehavior })
	},
})

export const CreateBatchStudentBehavior = mutationField('createBatchStudentBehavior', {
	type: CreateBatchStudentBehaviorPayload,
	args: { input: arg({ type: CreateBatchStudentBehaviorInput, required: true }) },
	async resolve(
		_,
		{ input: { studentIds, studentBehaviorType, markingPeriod, responsibilityPoints } },
		{ studentData, userData }
	) {
		studentData
		userData
		studentBehaviorType
		markingPeriod
		responsibilityPoints
		for (const student of studentIds) {
		}
		return { StudentBehaviors: [] }
	},
})
