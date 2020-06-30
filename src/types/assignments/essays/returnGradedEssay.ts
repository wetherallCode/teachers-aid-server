import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { ObjectID } from 'mongodb'
import { RubricEntryInput } from './rubrics'

export const ReturnGradedEssayInput = inputObjectType({
  name: 'ReturnGradedEssayInput',
  definition(t) {
    t.id('_id', { required: true })
    t.JSON('gradingDraft', { required: true })
    t.list.field('rubricEntries', { type: RubricEntryInput, required: true })
    t.int('score', { required: true })
  },
})

export const ReturnGradedEssayPayload = objectType({
  name: 'ReturnGradedEssayPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const ReturnGradedEssay = mutationField('returnGradedEssay', {
  type: ReturnGradedEssayPayload,
  args: { input: arg({ type: ReturnGradedEssayInput, required: true }) },
  async resolve(
    _,
    { input: { _id, gradingDraft, rubricEntries, score } },
    { assignmentData }
  ) {
    const essay = await assignmentData.findOne({ _id: new ObjectID(_id) })
    const currentScore = essay.score.earnedPoints

    if (currentScore < score) {
      await assignmentData.updateOne(
        { _id: new ObjectID(_id) },
        {
          $set: {
            'score.earnedPoints': score,
          },
        }
      )
    }

    await assignmentData.updateOne(
      { _id: new ObjectID(_id) },
      {
        $set: {
          'finalDraft.submittedFinalDraft': {
            draft: gradingDraft,
            rubricEntries,
            score,
          },
          'finalDraft.returned': true,
          'finalDraft.submitted': false,
        },
      }
    )

    const returnedEssay = await assignmentData.findOne({
      _id: new ObjectID(_id),
    })

    return { essay: returnedEssay }
  },
})
