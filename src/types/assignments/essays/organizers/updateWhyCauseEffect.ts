import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '..'
import {
  NexusGenRootTypes,
  NexusGenFieldTypes,
} from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UpdateWhyCauseEffectInput = inputObjectType({
  name: 'UpdateWhyCauseEffectInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.string('ultimateCause', { required: true })
    t.string('proximateCause', { required: true })
  },
})

export const UpdateWhyCauseEffectPayload = objectType({
  name: 'UpdateWhyCauseEffectPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateWhyCauseEffect = mutationField('updateWhyCauseEffect', {
  type: UpdateWhyCauseEffectPayload,
  args: { input: arg({ type: UpdateWhyCauseEffectInput, required: true }) },
  async resolve(
    _,
    { input: { essayId, ultimateCause, proximateCause } },
    { assignmentData }
  ) {
    const questionTypeCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
      { _id: new ObjectId(essayId) }
    )

    const { questionType } = questionTypeCheck.workingDraft
      .organizer! as NexusGenFieldTypes['AcademicOrganizer']

    if (
      questionTypeCheck.workingDraft.organizer!.hasOwnProperty('questionType')
    ) {
      if (questionType === 'WHY_CAUSE_EFFECT') {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.answerType.ultimateCause': ultimateCause,
              'workingDraft.organizer.answerType.proximateCause': proximateCause,
            },
          }
        )

        const essay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay }
      } else throw new Error('Wrong answerType')
    } else throw new Error('There is not question type selected')
  },
})
