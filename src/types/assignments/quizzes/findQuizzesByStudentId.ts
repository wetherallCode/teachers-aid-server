import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

import { Quiz } from '.'
import { MarkingPeriodEnum } from '../..'

export const FindQuizzesByStudentIdInput = inputObjectType({
  name: 'FindQuizzesByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const FindQuizzesByStudentIdPayload = objectType({
  name: 'FindQuizzesByStudentIdPayload',
  definition(t) {
    t.list.field('quizzes', { type: Quiz })
  },
})

export const FindQuizzesByStudentId = queryField('findQuizzesByStudentId', {
  type: FindQuizzesByStudentIdPayload,
  args: { input: arg({ type: FindQuizzesByStudentIdInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, markingPeriod } },
    { assignmentData }
  ) {
    const quizzes = await assignmentData
      .find({
        'hasOwner._id': new ObjectId(studentId),
        quizzableSections: { $exists: true },
        markingPeriod,
      })
      .toArray()
    return { quizzes }
  },
})
