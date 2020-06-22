import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, AdvancedSentenceStructureInput } from '..'

import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UpdateAdvancedOrganizerInput = inputObjectType({
  name: 'UpdateAdvancedOrganizerInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.field('advancedSentenceStructure', {
      type: AdvancedSentenceStructureInput,
      required: true,
    })
    t.string('restatement', { required: true })
    t.string('conclusion', { required: true })
  },
})

export const UpdateAdvancedOrganizerPayload = objectType({
  name: 'UpdateAdvancedOrganizerPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateAdvancedOrganizer = mutationField(
  'updateAdvancedOrganizer',
  {
    type: UpdateAdvancedOrganizerPayload,
    args: {
      input: arg({ type: UpdateAdvancedOrganizerInput, required: true }),
    },
    async resolve(
      _,
      {
        input: { essayId, advancedSentenceStructure, restatement, conclusion },
      },
      { assignmentData }
    ) {
      const organizerTypeCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
        { _id: new ObjectId(essayId) }
      )

      if (
        organizerTypeCheck.workingDraft.organizer!.hasOwnProperty(
          'advancedSentenceStructure'
        )
      ) {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.advancedSentenceStructure': advancedSentenceStructure,
              'workingDraft.organizer.restatement': restatement,
              'workingDraft.organizer.conclusion': conclusion,
            },
          }
        )
        const essay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay }
      } else throw new Error('This is not the correct organizer')
    },
  }
)
