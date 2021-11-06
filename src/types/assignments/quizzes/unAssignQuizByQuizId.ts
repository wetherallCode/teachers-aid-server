import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UnAssignQuizByQuizIdInput = inputObjectType({
  name: 'UnAssignQuizByQuizIdInput',
  definition(t) {
    t.id('quizId', { required: true })
  },
})

export const UnAssignQuizByQuizIdPayload = objectType({
  name: 'UnAssignQuizByQuizIdPayload',
  definition(t) {
    t.boolean('unAssigned')
  },
})

export const UnAssignQuizByQuizId = mutationField('unAssignQuizByQuizId', {
  type: UnAssignQuizByQuizIdPayload,
  args: { input: arg({ type: UnAssignQuizByQuizIdInput, required: true }) },
  async resolve(_, { input: { quizId } }, { assignmentData }) {
    const quizValidation: NexusGenRootTypes['Quiz'] =
      await assignmentData.findOne({
        _id: new ObjectId(quizId),
      })

    if (quizValidation) {
      {
        const { modifiedCount } = await assignmentData.updateOne(
          { _id: new ObjectId(quizId) },
          {
            $set: { assigned: false },
          }
        )

        return { unAssigned: modifiedCount === 1 ? true : false }
      }
    } else throw new Error('Quiz does not exist!')
  },
})
