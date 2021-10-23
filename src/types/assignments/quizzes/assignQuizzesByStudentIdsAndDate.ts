import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

import { Quiz } from '.'

export const AssignQuizzesByStudentIdsAndDateInput = inputObjectType({
  name: 'AssignQuizzesByStudentIdsAndDateInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.string('assignedDate'), { required: true }
  },
})

export const AssignQuizzesByStudentIdsAndDatePayload = objectType({
  name: 'AssignQuizzesByStudentIdsAndDatePayload',
  definition(t) {
    t.list.field('quizzes', { type: Quiz })
  },
})

export const AssignQuizzesByStudentIdsAndDate = mutationField(
  'assignQuizzesByStudentIdsAndDate',
  {
    type: AssignQuizzesByStudentIdsAndDatePayload,
    args: {
      input: arg({
        type: AssignQuizzesByStudentIdsAndDateInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { studentIds, assignedDate } },
      { assignmentData }
    ) {
      const quizzes: NexusGenRootTypes['Quiz'][] = []

      for (const studentId of studentIds) {
        const quizToUpdate = await assignmentData.updateOne(
          {
            quizzableSections: { $exists: true },
            'hasOwner._id': new ObjectId(studentId),
            assignedDate,
          },
          {
            $set: {
              assigned: true,
              // isActive: true,
            },
          }
        )

        const quiz = await assignmentData.find({
          quizzableSections: { $exists: true },
          'hasOwner._id': new ObjectId(studentId),
          assignedDate,
        })
        quizzes.push(quiz)
      }
      return { quizzes }
    },
  }
)
