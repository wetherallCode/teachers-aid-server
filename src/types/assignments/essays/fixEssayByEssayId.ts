import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

// export const FixEssayByEssayIdInput = inputObjectType({
//   name: 'FixEssayByEssayIdInput',
//   definition(t) {
//     t.id('essayId', { required: true })
//   },
// })

export const FixEssayByEssayIdPayload = objectType({
  name: 'FixEssayByEssayIdPayload',
  definition(t) {
    t.boolean('fixed')
  },
})

export const FixEssayByEssayId = mutationField('fixEssayByEssayId', {
  type: FixEssayByEssayIdPayload,
  // args: { input: arg({ type: FixEssayByEssayIdInput, required: true }) },
  async resolve(_, __, { assignmentData }) {
    const { modifiedCount } = await assignmentData.updateOne(
      {
        _id: new ObjectId('636388e49163260026d9cec5'),
      },
      {
        $set: {
          topic: {
            question:
              "Why did people oppose Hamilton's plan to pay the national debt?",
            questionType: 'WHY_CAUSE_EFFECT',
            writingLevel: 'DEVELOPING',
            essayQuestionId: '61700cfaa75e0c00261ef7c3',
          },
        },
      }
    )
    return { fixed: modifiedCount === 1 ? true : false }
  },
})
