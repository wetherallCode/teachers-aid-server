import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { Quiz } from '.'

export const FinishQuizInput = inputObjectType({
  name: 'FinishQuizInput',
  definition(t) {
    t.id('quizId', { required: true })
    t.float('responsibilityPoints', { required: true })
    t.float('earnedPoints', { required: true })
  },
})

export const FinishQuizPayload = objectType({
  name: 'FinishQuizPayload',
  definition(t) {
    t.field('quiz', { type: Quiz })
  },
})

export const FinishQuiz = mutationField('finishQuiz', {
  type: FinishQuizPayload,
  args: { input: arg({ type: FinishQuizInput, required: true }) },
  async resolve(
    _,
    { input: { quizId, responsibilityPoints, earnedPoints } },
    { assignmentData, studentData }
  ) {
    const quizValidation: NexusGenRootTypes['Quiz'] =
      await assignmentData.findOne({
        _id: new ObjectId(quizId),
      })

    if (quizValidation && !quizValidation.finishedQuiz) {
      const studentId = quizValidation.hasOwner._id!
      const markingPeriod = quizValidation.markingPeriod
      await assignmentData.updateOne(
        { _id: new ObjectId(quizId) },
        {
          $set: {
            finishedQuiz: true,
            isActive: false,
            assigned: false,
            'score.earnedPoints': earnedPoints,
            responsibilityPoints: responsibilityPoints,
          },
        }
      )
      await studentData.updateOne(
        {
          responsibilityPoints: { $exists: true },
          'student._id': new ObjectId(studentId),
          markingPeriod,
          behavior: { $exists: false },
        },
        {
          $inc: { responsibilityPoints: responsibilityPoints },
        }
      )
      const quiz: NexusGenRootTypes['Quiz'] = await assignmentData.findOne({
        _id: new ObjectId(quizId),
      })
      return { quiz }
    } else throw new Error('Quiz does not exist')
  },
})
