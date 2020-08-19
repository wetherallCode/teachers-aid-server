import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'
import { ObjectId } from 'mongodb'

export const RemoveSubmittedEssayFinalDraftInput = inputObjectType({
  name: 'RemoveSubmittedEssayFinalDraftInput',
  definition(t) {
    t.id('essayId', { required: true })
  },
})

export const RemoveSubmittedEssayFinalDraftPayload = objectType({
  name: 'RemoveSubmittedEssayFinalDraftPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const RemoveSubmittedEssayFinalDraft = queryField(
  'removeSubmittedEssayFinalDraft',
  {
    type: RemoveSubmittedEssayFinalDraftPayload,
    args: {
      input: arg({ type: RemoveSubmittedEssayFinalDraftInput, required: true }),
    },
    async resolve(_, { input: { essayId } }, { assignmentData }) {
      const essayValidation = await assignmentData.findOne({
        _id: new ObjectId(essayId),
      })
      if (essayValidation) {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $unset: 'finalDraft',
            $set: { assigned: true },
          }
        )

        const essay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay }
      }
      throw new Error('Essay does not exist!')
    },
  }
)
