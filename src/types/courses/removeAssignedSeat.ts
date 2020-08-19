import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { CourseInfo, StudentSeatInput } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const RemoveAssignedSeatInput = inputObjectType({
  name: 'RemoveAssignedSeatInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.field('assignedSeat', { type: StudentSeatInput, required: true })
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
    { input: { courseId, assignedSeat } },
    { courseData, userData }
  ) {
    const courseValidation: NexusGenRootTypes['CourseInfo'] = await courseData.findOne(
      {
        'course._id': new ObjectId(courseId),
      }
    )
    if (courseValidation) {
      const student: NexusGenRootTypes['Student'] = await userData.findOne({
        _id: new ObjectId(assignedSeat.studentId!),
      })

      if (student) {
        await courseData.updateOne(
          {
            'course._id': new ObjectId(courseId),
          },
          {
            $pull: {
              assignedSeats: { student },
            },
          }
        )
      } else throw new Error('Student does not exist.')
      const courseInfo = await courseData.findOne({
        'course._id': new ObjectId(courseId),
      })
      return { courseInfo }
    } else throw new Error('Course does not exist.')
  },
})
