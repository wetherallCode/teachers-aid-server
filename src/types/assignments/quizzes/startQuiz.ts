import {
  objectType,
  inputObjectType,
  arg,
  queryField,
  mutationField,
} from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const StartQuizInput = inputObjectType({
  name: 'StartQuizInput',
  definition(t) {
    t.id('quizId', { required: true })
  },
})

export const StartQuizPayload = objectType({
  name: 'StartQuizPayload',
  definition(t) {
    t.boolean('started')
  },
})

export const StartQuiz = mutationField('startQuiz', {
  type: StartQuizPayload,
  args: { input: arg({ type: StartQuizInput, required: true }) },
  async resolve(_, { input: { quizId } }, { assignmentData }) {
    const quizValidation: NexusGenRootTypes['Quiz'] =
      await assignmentData.findOne({
        _id: new ObjectId(quizId),
      })
    if (quizValidation) {
      if (
        !quizValidation.isActive &&
        !quizValidation.finishedQuiz &&
        !quizValidation.startedQuiz
      ) {
        const { modifiedCount } = await assignmentData.updateOne(
          { _id: new ObjectId(quizId) },
          {
            $set: { isActive: true, startedQuiz: true },
          }
        )

        return { started: modifiedCount === 1 ? true : false }
      } else throw new Error('Quiz already started!')
    } else throw new Error('Quiz does not exist!')
  },
})
