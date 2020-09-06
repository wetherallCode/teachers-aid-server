import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, DevelopingSentenceStructureInput, BasicQuestionEnum } from '..'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'

export const UpdateDevelopingOrganizerInput = inputObjectType({
  name: 'UpdateDevelopingOrganizerInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.field('basicQuestionType', { type: BasicQuestionEnum, required: true })
    t.field('developingSentenceStructure', {
      type: DevelopingSentenceStructureInput,
      required: true,
    })
    t.string('restatement', { required: true })
    t.string('answer', { required: true })
    t.string('conclusion', { required: true })
  },
})

export const UpdateDevelopingOrganizerPayload = objectType({
  name: 'UpdateDevelopingOrganizerPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateDevelopingOrganizer = mutationField(
  'updateDevelopingOrganizer',
  {
    type: UpdateDevelopingOrganizerPayload,
    args: {
      input: arg({ type: UpdateDevelopingOrganizerInput, required: true }),
    },
    async resolve(
      _,
      {
        input: {
          essayId,
          basicQuestionType,
          developingSentenceStructure,
          restatement,
          answer,
          conclusion,
        },
      },
      { assignmentData }
    ) {
      const organizerTypeCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
        { _id: new ObjectId(essayId) }
      )

      if (
        organizerTypeCheck.workingDraft.organizer!.hasOwnProperty(
          'developingSentenceStructure'
        )
      ) {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.basicQuestionType': basicQuestionType,
              'workingDraft.organizer.developingSentenceStructure': developingSentenceStructure,
              'workingDraft.organizer.restatement': restatement,
              'workingDraft.organizer.answer': answer,
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
