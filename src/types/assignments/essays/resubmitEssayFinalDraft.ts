import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, SubmittedFinalDraftsInput } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const ResubmitEssayFinalDraftInput = inputObjectType({
  name: 'ResubmitEssayFinalDraftInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.field('submittedFinalDraft', {
      type: SubmittedFinalDraftsInput,
      required: true,
    })
  },
})

export const ResubmitEssayFinalDraftPayload = objectType({
  name: 'ResubmitEssayFinalDraftPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const ResubmitEssayFinalDraft = mutationField(
  'resubmitEssayFinalDraft',
  {
    type: ResubmitEssayFinalDraftPayload,
    args: {
      input: arg({ type: ResubmitEssayFinalDraftInput, required: true }),
    },
    async resolve(
      _,
      { input: { essayId, submittedFinalDraft } },
      { assignmentData }
    ) {
      const essayCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
        { _id: new ObjectId(essayId), finalDraft: { $exists: true } }
      )
      const beginningValue = [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ]

      if (essayCheck) {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              assigned: false,
              'workingDraft.draft': JSON.stringify(beginningValue),
              'finalDraft.submitted': true,
              'finalDraft.returned': false,
            },
          }
        )
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $push: { 'finalDraft.submittedFinalDraft': submittedFinalDraft },
          }
        )
        const submittedEssay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay: submittedEssay }
      } else throw new Error('Essay has not been submitted yet.')
    },
  }
)
