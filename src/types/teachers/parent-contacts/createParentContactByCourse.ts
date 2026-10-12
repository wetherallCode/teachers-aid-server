import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const CreateParentContactByCourseInput = inputObjectType({
  name: 'CreateParentContactByCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

// export const CreateParentContactByCoursePayload = objectType({
//   name: 'CreateParentContactByCoursePayload',
//   definition(t) {
//     t.boolean('success', { nullable: false })
//   },
// })

// export const CreateParentContactByCourse = mutationField(
//   'createParentContactByCourse',
//   {
//     type: CreateParentContactByCoursePayload,
//     args: {
//       input: arg({ type: CreateParentContactByCourseInput, required: true }),
//     },
//     async resolve(
//       _,
//       { input: { courseId } },
//       { teacherData, courseData, userData },
//     ) {
//       const course = await courseData.findOne({ _id: new ObjectId(courseId) })
//       if (!course) {
//         throw new Error('Course not found')
//       }

//       const students = await userData
//         .find({
//           'inCourses._id': new ObjectId(courseId),
//         })
//         .toArray()

//       for (const student of students) {
//         const newContact: NexusGenRootTypes['ParentContact'] = {
//           contactType: 'EMAIL',
//           date: new Date().toLocaleDateString('en-US'),
//           student: student,
//           teacherId: '5f4572ec7074bbc020449f35',
//           contentOfContact: `Emailed Progress Report`,
//         }

//         const { insertedId } = await teacherData.insertOne(newContact)
//         newContact._id = insertedId
//       }
//       return { success: true }
//     },
//   },
// )
