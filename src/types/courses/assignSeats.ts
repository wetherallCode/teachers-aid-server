import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { CourseInfo, StudentSeatInput } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
// import { StudentSeatInput } from './studentSeat'
import { NexusInputObjectTypeDef } from '@nexus/schema/dist/core'

export const AssignSeatsInput = inputObjectType({
  name: 'AssignSeatsInput',
  definition(t) {
    t.id('courseId', { required: true })
    // t.field('assignedSeats', { type: StudentSeatInput, required: true })
    t.field('seat', { type: StudentSeatInput })
    // t.id('studentId',)
    // t.int('deskNumber')
    t.boolean('cohortBasedSeating', { required: true })
    // t.id('redCohortStudentId')
    // t.id('whiteCohortStudentId')
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
  async resolve(
    _,
    {
      input: {
        courseId,
        // deskNumber,
        seat,
        // redCohortStudentId,
        // whiteCohortStudentId,
        cohortBasedSeating,
      },
    },
    { courseData, userData }
  ) {
    const courseValidation: NexusGenRootTypes['CourseInfo'] = await courseData.findOne(
      {
        'course._id': new ObjectId(courseId),
      }
    )
    if (courseValidation) {
      if (cohortBasedSeating) {
        if (seat?.redCohortStudentId) {
          const student: NexusInputObjectTypeDef<'StudentSeatInput'> = await userData.findOne(
            {
              _id: new ObjectId(seat.redCohortStudentId!),
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
                'assignedSeats.$.redCohortStudent': student,
              },
            }
          )

          const courseInfo = await courseData.findOne({
            'course._id': new ObjectId(courseId),
          })
          return { courseInfo }
        }
        if (seat?.whiteCohortStudentId) {
          const student: NexusInputObjectTypeDef<'StudentSeatInput'> = await userData.findOne(
            {
              _id: new ObjectId(seat?.whiteCohortStudentId!),
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
                'assignedSeats.$.whiteCohortStudent': student,
              },
            }
          )

          const courseInfo = await courseData.findOne({
            'course._id': new ObjectId(courseId),
          })
          return { courseInfo }
        }
      }
      const student: NexusInputObjectTypeDef<'StudentSeatInput'> = await userData.findOne(
        {
          _id: new ObjectId(seat?.studentId!),
        }
      )

      await courseData.updateOne(
        {
          'course._id': new ObjectId(courseId),
          assignedSeats: {
            $elemMatch: { deskNumber: seat?.deskNumber },
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
