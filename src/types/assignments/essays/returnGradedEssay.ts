import { arg, inputObjectType, mutationField, objectType } from '@nexus/schema'
import { Essay } from '.'
import { ObjectID, ObjectId } from 'mongodb'
import { RubricSectionEnum } from './rubrics'

import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const ReturnGradedEssayInput = inputObjectType({
  name: 'ReturnGradedEssayInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('gradingDraft', { required: true })
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
    t.id('_id')
    t.string('entry', { required: true })
    t.int('score', { required: true })
    t.field('rubricSection', { type: RubricSectionEnum, required: true })
    t.string('howToImprove')
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
    { assignmentData, studentData },
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
        },
      )
    }
    console.log(
      rubricEntries.find((entry) => entry._id === '5f8ebe9a31fb5c0025be5100'),
    )

    // .find(
    //   (entry) =>
    //     new ObjectId(entry._id!) === new ObjectId('5f8ebe9a31fb5c0025be5100')
    // )

    //if student plagiarized from another student then they automatically lose 10 rp
    if (
      rubricEntries.find((entry) => entry._id === '5f8ebe9a31fb5c0025be5100')
    ) {
      studentData.updateOne(
        {
          'student._id': new ObjectId(student._id!),
          markingPeriod: essay.markingPeriod,
          responsibilityPoints: { $exists: true },
          behavior: { $exists: false },
        },
        {
          $inc: {
            responsibilityPoints: -10,
          },
        },
      )
    }

    if (!essay.leveledUp) {
      const studentToLevelUp: NexusGenRootTypes['ProgressTracker'] =
        await studentData.findOne({
          'student._id': new ObjectId(student._id!),
          writingProgressTracker: { $exists: true },
        })

      const { levelPoints } = studentToLevelUp.writingProgressTracker

      await studentData.updateOne(
        {
          'student._id': new ObjectId(student._id!),
          writingProgressTracker: { $exists: true },
        },
        {
          $set: {
            'writingProgressTracker.levelPoints': levelPoints + score,
          },
        },
      )

      if (levelPoints > 30) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(student._id!),
            writingProgressTracker: { $exists: true },
          },
          {
            $set: {
              'writingProgressTracker.overallWritingLevel': 'ACADEMIC',
            },
          },
        )
      }

      await assignmentData.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: { leveledUp: true },
        },
      )
    }

    await assignmentData.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          'finalDraft.returned': true,
          'finalDraft.submitted': false,
        },
      },
    )
    await assignmentData.updateOne(
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
          'finalDraft.submittedFinalDraft.$.additionalComments':
          additionalComments,
          'finalDraft.submittedFinalDraft.$.score': score,
          'finalDraft.submittedFinalDraft.$.graded': true,
        },
      },
    )

    const returnedEssay = await assignmentData.findOne({
      _id: new ObjectID(_id),
    })

    return { essay: returnedEssay }
  },
})
