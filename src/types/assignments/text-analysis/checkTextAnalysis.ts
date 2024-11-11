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
    t.int('paragraphCount', { required: true })
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
        paragraphCount,
      },
    },
    { assignmentData, studentData },
  ) {
    const textAnalysis: NexusGenRootTypes['TextAnalysis'] =
      await assignmentData.findOne({ _id: new ObjectId(textAnalysisId) })

    if (textAnalysis) {
      let groupWorkScore = 0

      // finishedEssentialQuestion ? groupWorkScore++ : groupWorkScore
      workedWellWithGroup ? groupWorkScore++ : groupWorkScore
      startedPromptly ? groupWorkScore++ : groupWorkScore
      onTask ? groupWorkScore++ : groupWorkScore

      finishedEssentialQuestion
      const normalizedGroupWorkScore = 1
      // console.log(groupWorkScore / 3 / textAnalysis.score.maxPoints)
      // TODO: Change Enum values
      let score =
        textAnalysisCompletion === 'FULL_COMPLETION'
          ? textAnalysis.score.maxPoints * normalizedGroupWorkScore
          : textAnalysisCompletion === 'PARTIAL_COMPLETION'
          ? textAnalysis.score.maxPoints * 0.9 * normalizedGroupWorkScore
          : textAnalysisCompletion === 'MAIN_IDEAS_ONLY'
          ? textAnalysis.score.maxPoints * 0.7 * normalizedGroupWorkScore
          : textAnalysisCompletion === 'MARKUP_ONLY'
          ? textAnalysis.score.maxPoints * 0.6 * normalizedGroupWorkScore
          : 0
      // TODO: figure out how to weight and score groupWorkScore and score with differing amounts of paragraphs
      // score = score * paragraphCount
      // update Responsibility Points for assignments that haven't been graded before
      const pointsOff = score * 0.1

      !workedWellWithGroup ? (score = score - pointsOff) : score
      !startedPromptly ? (score = score - pointsOff) : score
      !onTask ? (score = score - pointsOff) : score

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
              responsibilityPoints: paragraphCount * 2,
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
            startedPromptly,
            onTask,
            workedWellWithGroup,
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
