import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { CourseInfo } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const RemoveAssignedSeatInput = inputObjectType({
  name: 'RemoveAssignedSeatInput',
  definition(t) {
    t.id('courseId', { required: true })
    // t.field('assignedSeat', { type: StudentSeatInput, required: true })
    t.int('deskNumber', { required: true })
    t.id('redCohortStudentId')
    t.id('whiteCohortStudentId')
  },
})

export const RemoveAssignedSeatPayload = objectType({
  name: 'RemoveAssignedSeatPayload',
  definition(t) {
    t.field('courseInfo', { type: CourseInfo })
  },
})

// export const RemoveAssignedSeat = mutationField('removeAssignedSeat', {
//   type: RemoveAssignedSeatPayload,
//   args: { input: arg({ type: RemoveAssignedSeatInput, required: true }) },
//   async resolve(
//     _,
//     {
//       input: { courseId, deskNumber, redCohortStudentId, whiteCohortStudentId },
//     },
//     { courseData, userData }
//   ) {
//     const courseValidation: NexusGenRootTypes['CourseInfo'] = await courseData.findOne(
//       {
//         'course._id': new ObjectId(courseId),
//       }
//     )
//     if (courseValidation) {
//       if (redCohortStudentId) {
//         const student: NexusGenRootTypes['Student'] = await userData.findOne({
//           _id: new ObjectId(redCohortStudentId!),
//         })

//         if (student) {
//           await courseData.updateOne(
//             {
//               'course._id': new ObjectId(courseId),
//             },
//             {
//               $pull: {
//                 assignedSeats: { student },
//               },
//             }
//           )
//         } else throw new Error('Student does not exist.')
//         const courseInfo = await courseData.findOne({
//           'course._id': new ObjectId(courseId),
//         })
//         return { courseInfo }
//       }
//     } else throw new Error('Course does not exist.')
//   },
// })
