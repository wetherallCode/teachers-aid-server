import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { ObjectID, ObjectId } from 'mongodb'
import { RubricEntryInput, RubricSectionEnum } from './rubrics'
import { WritingLevelEnum } from '../..'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const ReturnGradedEssayInput = inputObjectType({
  name: 'ReturnGradedEssayInput',
  definition(t) {
    t.id('_id', { required: true })
    t.JSON('gradingDraft', { required: true })
    t.list.field('rubricEntries', {
      type: ReturnedRubricEntryInput,
      required: true,
    })
    t.int('draftNumber', { required: true })
    t.list.string('additionalComments')
    t.float('score', { required: true })
  },
})

export const ReturnedRubricEntryInput = inputObjectType({
  name: 'ReturnedRubricEntryInput',
  definition(t) {
    t.string('entry', { required: true })
    t.int('score', { required: true })
    t.field('rubricSection', { type: RubricSectionEnum, required: true })
    t.string('howToImprove')
    // t.field('rubricWritingLevels', {
    //   type: WritingLevelEnum,
    //   required: true,
    // })
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
    {
      input: {
        _id,
        gradingDraft,
        rubricEntries,
        additionalComments,
        score,
        draftNumber,
      },
    },
    { assignmentData, studentData }
  ) {
    const essay: NexusGenRootTypes['Essay'] = await assignmentData.findOne({
      _id: new ObjectID(_id),
    })
    const currentScore = essay.score.earnedPoints
    const student: NexusGenRootTypes['Student'] = essay.hasOwner

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

    if (!essay.leveledUp) {
      if (score >= 4) {
        const studentToLevelUp: NexusGenRootTypes['WritingMetrics'] = await studentData.findOne(
          {
            'student._id': new ObjectId(student._id!),
            overallWritingMetric: { $exists: true },
          }
        )

        const { levelPoints } = studentToLevelUp.overallWritingMetric

        await studentData.updateOne(
          {
            'student._id': new ObjectId(student._id!),
            overallWritingMetric: { $exists: true },
          },
          {
            $set: {
              'overallWritingMetric.levelPoints': levelPoints + 1,
            },
          }
        )

        if (levelPoints === 5) {
          await studentData.updateOne(
            {
              'student._id': new ObjectId(student._id!),
              overallWritingMetric: { $exists: true },
            },
            {
              $set: {
                'overallWritingMetric.overallWritingLevel': 'ACADEMIC',
              },
            }
          )
        }

        await assignmentData.updateOne(
          { _id: new ObjectId(_id) },
          {
            $set: { leveledUp: true },
          }
        )
      }
    }

    await assignmentData.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          'finalDraft.returned': true,
          'finalDraft.submitted': false,
        },
      }
    )
    const { modifiedCount } = await assignmentData.updateOne(
      {
        _id: new ObjectId(_id),
        'finalDraft.submittedFinalDraft': {
          $elemMatch: { draftNumber: draftNumber },
        },
      },
      {
        $set: {
          'finalDraft.submittedFinalDraft.$.draft': gradingDraft,
          'finalDraft.submittedFinalDraft.$.rubricEntries': rubricEntries,
          'finalDraft.submittedFinalDraft.$.additionalComments': additionalComments,
          'finalDraft.submittedFinalDraft.$.score': score,
          'finalDraft.submittedFinalDraft.$.graded': true,
        },
      }
    )

    const returnedEssay = await assignmentData.findOne({
      _id: new ObjectID(_id),
    })

    return { essay: returnedEssay }
  },
})
