import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

import { CourseInfo } from '.'

export const AddDeskToAssignedSeatsInput = inputObjectType({
	name: 'AddDeskToAssignedSeatsInput',
	definition(t) {
		t.id('courseId', { required: true })
		t.int('deskNumber', { required: true })
	},
})

export const AddDeskToAssignedSeatsPayload = objectType({
	name: 'AddDeskToAssignedSeatsPayload',
	definition(t) {
		t.field('courseInfo', { type: CourseInfo })
	},
})

export const AddDeskToAssignedSeats = mutationField('addDeskToAssignedSeats', {
	type: AddDeskToAssignedSeatsPayload,
	args: { input: arg({ type: AddDeskToAssignedSeatsInput, required: true }) },
	async resolve(_, { input: { courseId, deskNumber } }, { courseData }) {
		await courseData.updateOne(
			{
				'course._id': new ObjectId(courseId),
				assignedSeats: { $exists: true },
			},
			{
				$push: { assignedSeats: { deskNumber, student: null } },
			}
		)

		const courseInfo = await courseData.findOne({
			'course._id': new ObjectId(courseId),
			assignedSeats: { $exists: true },
		})

		return { courseInfo }
	},
})
