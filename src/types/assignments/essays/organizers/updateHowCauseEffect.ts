import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '..'
import {
  NexusGenFieldTypes,
  NexusGenRootTypes,
} from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UpdateHowCauseEffectInput = inputObjectType({
  name: 'UpdateHowCauseEffectInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.string('before', { required: true })
    t.string('cause', { required: true })
    t.string('after', { required: true })
  },
})

export const UpdateHowCauseEffectPayload = objectType({
  name: 'UpdateHowCauseEffectPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateHowCauseEffect = mutationField('updateHowCauseEffect', {
  type: UpdateHowCauseEffectPayload,
  args: { input: arg({ type: UpdateHowCauseEffectInput, required: true }) },
  async resolve(
    _,
    { input: { essayId, before, cause, after } },
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
      if (questionType === 'HOW_CAUSE_EFFECT') {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.answerType.before': before,
              'workingDraft.organizer.answerType.cause': cause,
              'workingDraft.organizer.answerType.after': after,
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
