import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const ModifiyEssayQuestionsInput = inputObjectType({
//     name: 'ModifiyEssayQuestionsInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const ModifiyEssayQuestionsPayload = objectType({
  name: 'ModifiyEssayQuestionsPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifiyEssayQuestions = mutationField('modifiyEssayQuestions', {
  type: ModifiyEssayQuestionsPayload,
  // args: { input: arg({ type: ModifiyEssayQuestionsInput, required: true }) },
  async resolve(_, __, { questionData }) {
    await questionData.updateMany(
      { questionUsageType: 'ESSAY' },
      { $set: { sgoQuestion: false } }
    )
    return { modified: true }
  },
})
