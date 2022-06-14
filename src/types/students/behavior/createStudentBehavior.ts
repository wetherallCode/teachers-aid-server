import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { BehaviorEnum, StudentBehavior } from '.'
import { ObjectId } from 'mongodb'
import { MarkingPeriodEnum } from '../..'

export const CreateStudentBehaviorInput = inputObjectType({
	name: 'CreateStudentBehaviorInput',
	definition(t) {
		t.id('studentId', { required: true })
		t.string('behaviorTypeId', { required: true })
		t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
		t.float('responsibilityPoints', { required: true })
	},
})

export const CreateStudentBehaviorPayload = objectType({
	name: 'CreateStudentBehaviorPayload',
	definition(t) {
		t.field('studentBehavior', { type: StudentBehavior })
	},
})

export const CreateStudentBehavior = mutationField('createStudentBehavior', {
	type: CreateStudentBehaviorPayload,
	args: { input: arg({ type: CreateStudentBehaviorInput, required: true }) },
	async resolve(
		_,
		{ input: { studentId, behaviorTypeId, markingPeriod, responsibilityPoints } },
		{ studentData, userData, behaviorData }
	) {
		const studentCheck: NexusGenRootTypes['Student'] = await userData.findOne({
			_id: new ObjectId(studentId),
		})

		if (studentCheck) {
			const behavior = await behaviorData.findOne({ _id: behaviorTypeId })

			const studentBehavior: NexusGenRootTypes['StudentBehavior'] = {
				behavior,
				date: new Date().toLocaleDateString(),
				student: studentCheck,
				responsibilityPoints,
			}
			const { insertedId } = await studentData.insertOne(studentBehavior)
			studentBehavior._id = insertedId

			await studentData.updateOne(
				{
					'student._id': new ObjectId(studentId),
					markingPeriod: markingPeriod,
					responsibilityPoints: { $exists: true },
				},
				{
					$inc: {
						responsibilityPoints,
					},
				}
			)
			return { studentBehavior }
		} else throw new Error('Student does not exist.')
	},
})
