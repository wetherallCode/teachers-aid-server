import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { ObjectID } from 'mongodb'

export const UpdateWorkingDraftInput = inputObjectType({
  name: 'UpdateWorkingDraftInput',
  definition(t) {
    t.id('_id', { required: true })
    t.JSON('updatedDraft', { required: true })
  },
})

export const UpdateWorkingDraftPayload = objectType({
  name: 'UpdateWorkingDraftPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateWorkingDraft = mutationField('updateWorkingDraft', {
  type: UpdateWorkingDraftPayload,
  args: { input: arg({ type: UpdateWorkingDraftInput, required: true }) },
  async resolve(_, { input: { _id, updatedDraft } }, { assignmentData }) {
    console.log(updatedDraft)
    await assignmentData.updateOne(
      { _id: new ObjectID(_id) },
      { $set: { 'workingDraft.draft': updatedDraft } }
    )
    const updatedDraftDocument = await assignmentData.findOne({
      _id: new ObjectID(_id),
    })

    return { essay: updatedDraftDocument }
  },
})
