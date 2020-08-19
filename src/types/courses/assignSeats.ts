import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { CourseInfo } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { StudentSeatInput } from './studentSeat'
import { NexusInputObjectTypeDef } from '@nexus/schema/dist/core'

export const AssignSeatsInput = inputObjectType({
  name: 'AssignSeatsInput',
  definition(t) {
    t.id('courseId', { required: true })
    // t.field('assignedSeats', { type: StudentSeatInput, required: true })
    t.field('seat', { type: StudentSeatInput, required: true })
    // t.id('studentId',)
  },
})

export const AssignSeatsPayload = objectType({
  name: 'AssignSeatsPayload',
  definition(t) {
    t.field('courseInfo', { type: CourseInfo })
  },
})

export const AssignSeats = mutationField('assignSeats', {
  type: AssignSeatsPayload,
  args: { input: arg({ type: AssignSeatsInput, required: true }) },
  async resolve(_, { input: { courseId, seat } }, { courseData, userData }) {
    const courseValidation: NexusGenRootTypes['CourseInfo'] = await courseData.findOne(
      {
        'course._id': new ObjectId(courseId),
      }
    )
    if (courseValidation) {
      const student: NexusInputObjectTypeDef<'StudentSeatInput'> = await userData.findOne(
        {
          _id: new ObjectId(seat.studentId!),
        }
      )

      await courseData.updateOne(
        {
          'course._id': new ObjectId(courseId),
          assignedSeats: {
            $elemMatch: { deskNumber: seat.deskNumber },
          },
        },
        {
          $set: {
            'assignedSeats.$.student': student,
          },
        }
      )

      const courseInfo = await courseData.findOne({
        'course._id': new ObjectId(courseId),
      })
      return { courseInfo }
    } else throw new Error('Course Does Not Exist')
  },
})
