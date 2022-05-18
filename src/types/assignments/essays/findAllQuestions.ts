import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { EssayQuestion } from '../../questions'

// export const FindAllQuestionsInput = inputObjectType({
//     name: 'FindAllQuestionsInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const FindAllQuestionsPayload = objectType({
  name: 'FindAllQuestionsPayload',
  definition(t) {
    t.list.string('questions')
  },
})

export const FindAllQuestions = queryField('findAllQuestions', {
  type: FindAllQuestionsPayload,
  // args: { input: arg({ type: FindAllQuestionsInput, required: true }) },
  async resolve(_, __, { questionData }) {
    const essayQuestions: NexusGenRootTypes['EssayQuestion'][] =
      await questionData
        .find({
          questionUsageType: 'ESSAY',
        })
        .toArray()
    const questions = essayQuestions.map(
      (q) => q.questionParts.originalQuestion
    )
    return { questions }
  },
})
