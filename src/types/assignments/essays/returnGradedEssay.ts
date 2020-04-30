import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { ObjectID } from 'mongodb'

export const ReturnGradedEssayInput = inputObjectType({
  name: 'ReturnGradedEssayInput',
  definition(t) {
    t.id('_id', { required: true })
    t.JSON('gradedDraft', { required: true })
    t.list.string('comments', { required: true })
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
    { input: { _id, gradedDraft, comments, score } },
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
            draft: gradedDraft,
            comments,
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
