import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const AssignTextAnalysesInput = inputObjectType({
  name: 'AssignTextAnalysesInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.id('associatedLessonId', { required: true })
    t.date('assignedDate', { required: true })
    t.date('dueDate', { required: true })
  },
})

export const AssignTextAnalysesPayload = objectType({
  name: 'AssignTextAnalysesPayload',
  definition(t) {
    // t.field('textAnals', { type: textAnals })
    t.boolean('assigned')
  },
})

export const AssignTextAnalyses = mutationField('assignTextAnalyses', {
  type: AssignTextAnalysesPayload,
  args: { input: arg({ type: AssignTextAnalysesInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, associatedLessonId, assignedDate, dueDate } },
    { assignmentData, studentData }
  ) {
    let modifiedTextAnalysesCount = 0
    for (const _id of studentIds) {
      const textAnalysisValidation: NexusGenRootTypes['TextAnalysis'] =
        await assignmentData.findOne({
          'hasOwner._id': new ObjectId(_id),
          associatedLessonId,
          textAnalysisCompletion: { $exists: true },
        })
      if (textAnalysisValidation) {
        const { modifiedCount } = await assignmentData.updateOne(
          {
            'hasOwner._id': new ObjectId(_id),
            associatedLessonId,
            textAnalysisCompletion: { $exists: true },
          },
          {
            $set: {
              dueDate,
              assignedDate,
              assigned: true,
            },
          }
        )
        modifiedCount && modifiedTextAnalysesCount + 1
        await studentData.updateOne(
          {
            'student._id': new ObjectId(_id),
            markingPeriod: textAnalysisValidation.markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          {
            $inc: {
              responsibilityPoints: -textAnalysisValidation.score.maxPoints,
            },
          }
        )
      }
    }
    return {
      assigned: modifiedTextAnalysesCount === studentIds.length ? true : false,
    }
  },
})
