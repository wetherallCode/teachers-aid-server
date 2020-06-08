import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { MarkingPeriodEnum } from '../../general'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { QuestionTypeEnum } from '../..'

export const AssignEssayInput = inputObjectType({
  name: 'AssignEssayInput',
  definition(t) {
    t.boolean('assigned')
    // t.field('topic', { type: TopicInput, required: true })
    // t.field('readings', { type: ReadingsInput, required: true })
    // t.list.string('assignedCourseId', { required: true })
    // // t.list.string('hasOwner', { required: true })
    // t.string('hasAssignerId', { required: true })
    // t.int('maxPoints', { required: true })
    // t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    // t.date('dueDate', { required: true })
  },
})

export const AssignEssayPayload = objectType({
  name: 'AssignEssayPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

// export const AssignEssay = mutationField('assignEssay', {
//   type: AssignEssayPayload,
//   args: { input: arg({ type: AssignEssayInput, required: true }) },
//   async resolve(
//     _,
//     {
//       input: {
//         assigned
//       },
//     },
//     { assignmentData }
//   ) {
//     const find
//   return {essays}
// // })
