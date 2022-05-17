import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
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
    t.field('questions', { type: EssayQuestion })
  },
})

export const FindAllQuestions = queryField('findAllQuestions', {
  type: FindAllQuestionsPayload,
  // args: { input: arg({ type: FindAllQuestionsInput, required: true }) },
  async resolve(_, __, { questionData }) {
    const questions = await questionData
      .find({ questionUsageType: 'ESSAY' })
      .toArray()
    return { questions }
  },
})
