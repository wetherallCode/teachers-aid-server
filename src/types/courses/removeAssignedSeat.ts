import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { CourseInfo } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { StudentCohortEnum } from '../students'

export const RemoveAssignedSeatInput = inputObjectType({
  name: 'RemoveAssignedSeatInput',
  definition(t) {
    t.id('courseId', { required: true })
    // t.field('assignedSeat', { type: StudentSeatInput, required: true })
    t.int('deskNumber', { required: true })
    t.boolean('cohortBased', { required: true })
    t.field('cohortType', { type: StudentCohortEnum })
  },
})

export const RemoveAssignedSeatPayload = objectType({
  name: 'RemoveAssignedSeatPayload',
  definition(t) {
    t.field('courseInfo', { type: CourseInfo })
  },
})

export const RemoveAssignedSeat = mutationField('removeAssignedSeat', {
  type: RemoveAssignedSeatPayload,
  args: { input: arg({ type: RemoveAssignedSeatInput, required: true }) },
  async resolve(
    _,
    { input: { courseId, deskNumber, cohortBased, cohortType } },
    { courseData }
  ) {
    const courseValidation: NexusGenRootTypes['CourseInfo'] = await courseData.findOne(
      {
        'course._id': new ObjectId(courseId),
      }
    )
    if (courseValidation) {
      if (cohortBased) {
        if (cohortType === 'RED') {
          // const student: NexusGenRootTypes['Student'] = await userData.findOne({
          //   _id: new ObjectId(redCohortStudentId!),
          // })

          await courseData.updateOne(
            {
              'course._id': new ObjectId(courseId),
              assignedSeats: {
                $elemMatch: { deskNumber },
              },
            },
            {
              $set: {
                'assignedSeats.$.redCohortStudent': null,
              },
            }
          )

          const courseInfo = await courseData.findOne({
            'course._id': new ObjectId(courseId),
          })
          return { courseInfo }
        }
        if (cohortType === 'WHITE') {
          // const student: NexusGenRootTypes['Student'] = await userData.findOne({
          //   _id: new ObjectId(redCohortStudentId!),
          // })

          await courseData.updateOne(
            {
              'course._id': new ObjectId(courseId),
              assignedSeats: {
                $elemMatch: { deskNumber },
              },
            },
            {
              $set: {
                'assignedSeats.$.whiteCohortStudent': null,
              },
            }
          )

          const courseInfo = await courseData.findOne({
            'course._id': new ObjectId(courseId),
          })
          return { courseInfo }
        }
      }
      await courseData.updateOne(
        {
          'course._id': new ObjectId(courseId),
          assignedSeats: {
            $elemMatch: { deskNumber },
          },
        },
        {
          $set: {
            'assignedSeats.$.student': null,
          },
        }
      )
      const courseInfo = await courseData.findOne({
        'course._id': new ObjectId(courseId),
      })
      return { courseInfo }
    } else throw new Error('Course does not exist.')
  },
})
