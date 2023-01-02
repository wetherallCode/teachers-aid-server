import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { TextAnalysisCompletionEnum } from './textAnalysis'

export const CheckTextAnalysisInput = inputObjectType({
  name: 'CheckTextAnalysisInput',
  definition(t) {
    t.id('textAnalysisId', { required: true })
    t.field('textAnalysisCompletion', {
      type: TextAnalysisCompletionEnum,
      required: true,
    })
  },
})

export const CheckTextAnalysisPayload = objectType({
  name: 'CheckTextAnalysisPayload',
  definition(t) {
    // t.field('', { type:  })
    t.boolean('checked')
  },
})

export const CheckTextAnalysis = mutationField('checkTextAnalysis', {
  type: CheckTextAnalysisPayload,
  args: { input: arg({ type: CheckTextAnalysisInput, required: true }) },
  async resolve(
    _,
    { input: { textAnalysisId, textAnalysisCompletion } },
    { assignmentData, studentData }
  ) {
    const textAnalysis: NexusGenRootTypes['TextAnalysis'] =
      await assignmentData.findOne({ _id: new ObjectId(textAnalysisId) })

    if (textAnalysis) {
      let score =
        textAnalysisCompletion === 'MAIN_IDEAS_AND_MARKUP'
          ? textAnalysis.score.maxPoints
          : textAnalysisCompletion === 'MAIN_IDEAS_ONLY'
          ? textAnalysis.score.maxPoints * 0.6
          : textAnalysisCompletion === 'MARKUP_ONLY'
          ? textAnalysis.score.maxPoints * 0.4
          : textAnalysisCompletion === 'PARTIAL_COMPLETION'
          ? textAnalysis.score.maxPoints * 0.2
          : 0
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
          }
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
        }
      )
      return { checked: modifiedCount === 1 ? true : false }
    } else throw new Error('Text Analysis does not exist')
  },
})
