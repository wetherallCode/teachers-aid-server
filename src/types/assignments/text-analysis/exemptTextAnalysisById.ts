import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const ExemptTextAnalysisByIdInput = inputObjectType({
  name: 'ExemptTextAnalysisByIdInput',
  definition(t) {
    t.id('textAnalysisId', { required: true })
  },
})

export const ExemptTextAnalysisByIdPayload = objectType({
  name: 'ExemptTextAnalysisByIdPayload',
  definition(t) {
    t.boolean('updated')
  },
})

export const ExemptTextAnalysisById = mutationField('exemptTextAnalysisById', {
  type: ExemptTextAnalysisByIdPayload,
  args: { input: arg({ type: ExemptTextAnalysisByIdInput, required: true }) },
  async resolve(_, { input: { textAnalysisId } }, { assignmentData }) {
    const textAnalysis: NexusGenRootTypes['TextAnalysis'] =
      await assignmentData.findOne({
        _id: new ObjectId(textAnalysisId),
      })
    if (textAnalysis) {
      await assignmentData.updateMany(
        { _id: new ObjectId(textAnalysisId) },
        { $set: { exempt: !textAnalysis.exempt } },
      )
      return { updated: true }
    } else throw new Error('TextAnalysis Not Found')
  },
})
