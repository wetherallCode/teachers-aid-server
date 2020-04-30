import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { SubmittedFinalDraftsInput, Essay } from '.'
import { ObjectId } from 'mongodb'

export const SubmitEssayFinalDraftInput = inputObjectType({
  name: 'SubmitEssayFinalDraftInput',
  definition(t) {
    t.id('_id', { required: true })
    t.field('submittedFinalDraft', {
      type: SubmittedFinalDraftsInput,
      required: true,
    })
    t.boolean('late', { required: true })
  },
})

export const SubmitEssayFinalDraftPayload = objectType({
  name: 'SubmitEssayFinalDraftPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const SubmitEssayFinalDraft = mutationField('submitEssayFinalDraft', {
  type: SubmitEssayFinalDraftPayload,
  args: { input: arg({ type: SubmitEssayFinalDraftInput, required: true }) },
  async resolve(
    _,
    { input: { _id, submittedFinalDraft, late } },
    { assignmentData }
  ) {
    const submittedEssay = await assignmentData.findOne({
      _id: new ObjectId(_id),
    })

    await assignmentData.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          late,
          finalDraft: {
            submittedFinalDraft,
            submitted: true,
            returned: false,
            submitTime: new Date().toLocaleString(),
          },
        },
      }
    )

    return { essay: submittedEssay }
  },
})
