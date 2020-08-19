import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UpdateGradingDraftInput = inputObjectType({
  name: 'UpdateGradingDraftInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.JSON('gradingDraft')
    t.int('draftNumber')
  },
})

export const UpdateGradingDraftPayload = objectType({
  name: 'UpdateGradingDraftPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateGradingDraft = mutationField('updateGradingDraft', {
  type: UpdateGradingDraftPayload,
  args: { input: arg({ type: UpdateGradingDraftInput, required: true }) },
  async resolve(
    _,
    { input: { essayId, gradingDraft, draftNumber } },
    { assignmentData }
  ) {
    const finalDraftValidation: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
      { _id: new ObjectId(essayId), finalDraft: { $exists: true } }
    )

    if (finalDraftValidation) {
      const { modifiedCount } = await assignmentData.updateOne(
        {
          _id: new ObjectId(essayId),
          'finalDraft.submittedFinalDraft': {
            $elemMatch: { draftNumber: draftNumber },
          },
        },
        {
          $set: {
            'finalDraft.submittedFinalDraft.$.gradingDraft': gradingDraft,
          },
        }
      )
      const essay: NexusGenRootTypes['Essay'] = await assignmentData.findOne({
        _id: new ObjectId(essayId),
      })

      return { essay }
    } else throw new Error('Essay has not been submitted.')
  },
})
