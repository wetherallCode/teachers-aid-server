import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, AcademicSentenceStructureInput } from '..'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UpdateAcademicOrganizerInput = inputObjectType({
  name: 'UpdateAcademicOrganizerInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.field('academicSentenceStructure', {
      type: AcademicSentenceStructureInput,
      required: true,
    })
    t.string('restatement', { required: true })
    t.string('conclusion', { required: true })
  },
})

export const UpdateAcademicOrganizerPayload = objectType({
  name: 'UpdateAcademicOrganizerPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateAcademicOrganizer = mutationField(
  'updateAcademicOrganizer',
  {
    type: UpdateAcademicOrganizerPayload,
    args: {
      input: arg({ type: UpdateAcademicOrganizerInput, required: true }),
    },
    async resolve(
      _,
      {
        input: { essayId, academicSentenceStructure, restatement, conclusion },
      },
      { assignmentData }
    ) {
      const organizerTypeCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
        { _id: new ObjectId(essayId) }
      )

      if (
        organizerTypeCheck.workingDraft.organizer!.hasOwnProperty(
          'academicSentenceStructure'
        )
      ) {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.academicSentenceStructure': academicSentenceStructure,
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
