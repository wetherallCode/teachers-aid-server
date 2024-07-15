import { arg, inputObjectType, mutationField, objectType } from '@nexus/schema'
import { TextAnalysisCompletionEnum } from './TextAnalysisCompletionEnum'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CheckTextAnalysisInput = inputObjectType({
  name: 'CheckTextAnalysisInput',
  definition(t) {
    t.id('textAnalysisId', { required: true })
    t.field('textAnalysisCompletion', {
      type: TextAnalysisCompletionEnum,
      required: true,
    })
    t.boolean('finishedEssentialQuestion', { required: true })
    t.boolean('workedWellWithGroup', { required: true })
    t.boolean('onTask', { required: true })
    t.boolean('startedPromptly', { required: true })
  },
})

export const CheckTextAnalysisPayload = objectType({
  name: 'CheckTextAnalysisPayload',
  definition(t) {
    t.boolean('checked')
  },
})

export const CheckTextAnalysis = mutationField('checkTextAnalysis', {
  type: CheckTextAnalysisPayload,
  args: { input: arg({ type: CheckTextAnalysisInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        textAnalysisId,
        textAnalysisCompletion,
        finishedEssentialQuestion,
        workedWellWithGroup,
        startedPromptly,
        onTask,
      },
    },
    { assignmentData, studentData },
  ) {
    const textAnalysis: NexusGenRootTypes['TextAnalysis'] =
      await assignmentData.findOne({ _id: new ObjectId(textAnalysisId) })

    if (textAnalysis) {
      let groupWorkScore = 0

      finishedEssentialQuestion ? groupWorkScore++ : groupWorkScore
      workedWellWithGroup ? groupWorkScore++ : groupWorkScore
      startedPromptly ? groupWorkScore++ : groupWorkScore
      onTask ? groupWorkScore++ : groupWorkScore

      // TODO: Change Enum values
      let score =
        textAnalysisCompletion === 'FULL_COMPLETION'
          ? textAnalysis.score.maxPoints
          : textAnalysisCompletion === 'PARTIAL_COMPLETION'
            ? textAnalysis.score.maxPoints * 0.6
            : textAnalysisCompletion === 'MAIN_IDEAS_ONLY'
              ? textAnalysis.score.maxPoints * 0.4
              : textAnalysisCompletion === 'MARKUP_ONLY'
                ? textAnalysis.score.maxPoints * 0.2
                : 0
      // TODO: figure out how to weight and score groupWorkScore and score with differing amounts of paragraphs

      // update Responsibility Points for assignments that haven't been graded before
      if (textAnalysis.missing) {
        await studentData.updateOne(
          {
            'student._id': textAnalysis.hasOwner._id!,
            markingPeriod: textAnalysis.markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          {
            $inc: {
              responsibilityPoints: textAnalysis.score.maxPoints + score,

            },
          },
        )
      }

      // modify assignment to reflect completion status
      const { modifiedCount } = await assignmentData.updateOne(
        { _id: new ObjectId(textAnalysisId) },
        {
          $set: {
            textAnalysisCompletion,
            missing: false,
            late: false,
            'score.earnedPoints': score,
          },
        },
      )
      return { checked: modifiedCount === 1 }
    } else throw new Error('Text Analysis does not exist')
  },
})
