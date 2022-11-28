import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const ResetAllEssayQuestionsSGOStatusInput = inputObjectType({
//     name: 'ResetAllEssayQuestionsSGOStatusInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const ResetAllEssayQuestionsSGOStatusPayload = objectType({
  name: 'ResetAllEssayQuestionsSGOStatusPayload',
  definition(t) {
    t.boolean('reset')
  },
})

export const ResetAllEssayQuestionsSGOStatus = mutationField(
  'resetAllEssayQuestionsSGOStatus',
  {
    type: ResetAllEssayQuestionsSGOStatusPayload,
    // args: {
    //   input: arg({
    //     type: ResetAllEssayQuestionsSGOStatusInput,
    //     required: true,
    //   }),
    // },
    async resolve(_, __, { questionData }) {
      await questionData.updateMany(
        { questionUsageType: 'ESSAY' },
        { $set: { sgoQuestion: false } }
      )
      return { reset: true }
    },
  }
)
