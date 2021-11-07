import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const ForceFinishQuizInput = inputObjectType({
  name: 'ForceFinishQuizInput',
  definition(t) {
    t.id('quizId', { required: true })
  },
})

export const ForceFinishQuizPayload = objectType({
  name: 'ForceFinishQuizPayload',
  definition(t) {
    t.boolean('finished')
  },
})

export const ForceFinishQuiz = mutationField('forceFinishQuiz', {
  type: ForceFinishQuizPayload,
  args: { input: arg({ type: ForceFinishQuizInput, required: true }) },
  async resolve(_, { input: { quizId } }, { assignmentData }) {
    const quizValidation: NexusGenRootTypes['Quiz'] =
      await assignmentData.findOne({
        _id: new ObjectId(quizId),
      })
    if (quizValidation) {
      const { modifiedCount } = await assignmentData.updateOne(
        { _id: new ObjectId(quizId) },
        {
          $set: { forcedFinish: true },
        }
      )
      return { finished: modifiedCount === 1 ? true : false }
    } else throw new Error('Quiz does not exist')
  },
})
