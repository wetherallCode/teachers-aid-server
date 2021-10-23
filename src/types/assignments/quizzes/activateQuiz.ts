import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const ActivateQuizInput = inputObjectType({
  name: 'ActivateQuizInput',
  definition(t) {
    t.id('quizId', { required: true })
    t.boolean('activate', { required: true })
  },
})

export const ActivateQuizPayload = objectType({
  name: 'ActivateQuizPayload',
  definition(t) {
    t.boolean('activated')
  },
})

export const ActivateQuiz = mutationField('activateQuiz', {
  type: ActivateQuizPayload,
  args: { input: arg({ type: ActivateQuizInput, required: true }) },
  async resolve(_, { input: { quizId, activate } }, { assignmentData }) {
    const quizValidation: NexusGenRootTypes['Quiz'] =
      await assignmentData.findOne({
        _id: new ObjectId(quizId),
      })
    if (quizValidation) {
      const { modifiedCount } = await assignmentData.updateOne(
        { _id: new ObjectId(quizId) },
        {
          $set: { isActive: activate },
        }
      )
      return { activated: modifiedCount === 1 ? true : false }
    } else throw new Error('Quiz does not exist')
  },
})
