import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { MarkingPeriodEnum } from '../../general'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { QuestionTypeEnum } from '../..'

export const AssignEssayInput = inputObjectType({
  name: 'AssignEssayInput',
  definition(t) {
    t.field('topic', { type: TopicInput, required: true })
    t.field('readings', { type: ReadingsInput, required: true })
    t.list.string('assignedCourseId', { required: true })
    // t.list.string('hasOwner', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.date('dueDate', { required: true })
  },
})

export const TopicInput = inputObjectType({
  name: 'TopicInput',
  definition(t) {
    t.string('question', { required: true })
    t.field('questionType', { type: QuestionTypeEnum, required: true })
  },
})

export const AssignEssayPayload = objectType({
  name: 'AssignEssayPayload',
  definition(t) {
    t.list.field('essay', { type: Essay })
  },
})

export const ReadingsInput = inputObjectType({
  name: 'ReadingsInput',
  definition(t) {
    t.string('readingPages', { required: true })
    t.string('readingSections', { required: true })
  },
})

// export const AssignEssay = mutationField('assignEssay', {
//   type: AssignEssayPayload,
//   args: { input: arg({ type: AssignEssayInput, required: true }) },
//   async resolve(
//     _,
//     {
//       input: {
//         topic,
//         readings,
//         assignedCourseId,
//         hasAssignerId,
//         maxPoints,
//         markingPeriod,
//         dueDate,
//       },
//     },
//     { assignmentData, userData }
//   ) {
//     console.log(new Date().toISOString())

//     const studentList: NexusGenRootTypes['Student'][] = []

//     for (const _id in assignedCourseId) {
//       const students = await userData
//         .find({
//           'inCourses._id': new ObjectId(assignedCourseId[_id]),
//         })
//         .toArray()
//       students.forEach((student: NexusGenRootTypes['Student']) => {
//         studentList.push(student)
//       })
//     }

//     const assigner = await userData.findOne({
//       _id: new ObjectId(hasAssignerId),
//     })

//     const newEssays: NexusGenRootTypes['Essay'][] = []

//     const beginningValue = [
//       {
//         type: 'paragraph',
//         children: [{ text: '' }],
//       },
//     ]

//     for (const student in studentList) {
//       const newEssay: NexusGenRootTypes['Essay'] = {
//         topic,
//         assignedDate: new Date().toLocaleDateString(),
//         dueDate,
//         readings,
//         workingDraft: {
//           draft: JSON.stringify(beginningValue),
//         },
//         markingPeriod,
//         hasAssigner: assigner,
//         hasOwner: await userData.findOne({
//           _id: new ObjectId(studentList[student]._id!),
//         }),
//         score: { earnedPoints: 0, maxPoints },
//         late: true,
//         exempt: false,
//       }
//       const { insertedId } = await assignmentData.insertOne(newEssay)
//       newEssay._id = insertedId
//       newEssays.push(newEssay)
//     }
//     console.log(new Date().toISOString())
//     return { essay: newEssays }
//   },
// })
