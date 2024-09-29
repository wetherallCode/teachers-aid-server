import { arg, inputObjectType, mutationField, objectType } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuideReviewOptionsEnum } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const ReviewReadingGuidesInput = inputObjectType({
  name: 'ReviewReadingGuidesInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    t.field('effort', { type: ReadingGuideReviewOptionsEnum, required: true })
  },
})

export const ReviewReadingGuidesPayload = objectType({
  name: 'ReviewReadingGuidesPayload',
  definition(t) {
    t.boolean('reviewed')
  },
})

export const ReviewReadingGuides = mutationField('reviewReadingGuides', {
  type: ReviewReadingGuidesPayload,
  args: { input: arg({ type: ReviewReadingGuidesInput, required: true }) },
  async resolve(
    _,
    { input: { readingGuideId, effort } },
    { assignmentData, studentData },
  ) {
    const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] =
      await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })

    if (readingGuideValidation) {
      const effortPoints = (points: number) =>
        effort === 'GOOD_EFFORT'
          ? points
          : effort === 'SOME_EFFORT'
            ? points * 0.75
            : effort === 'LITTLE_EFFORT'
              ? points * 0.5
              : effort === 'DID_NOT_ANSWER_QUESTIONS_CORRECTLY'
                ? points * 0.25
                : effort === 'OFF_TOPIC'
                  ? points * 0.1
                  : 0

      const { modifiedCount: progressTrackerModifiedCount } =
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          { $inc: { 'readingGuideProgressTracker.levelPoints': 1 } },
        )

      const student: NexusGenRootTypes['ProgressTracker'] =
        await studentData.findOne({
          'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
          readingGuideProgressTracker: { $exists: true },
        })

      const { levelPoints } = student.readingGuideProgressTracker

      if (levelPoints >= 10 && levelPoints < 25) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'DEVELOPING',
            },
          },
        )
      }
      if (levelPoints >= 25 && levelPoints < 40) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'ACADEMIC',
            },
          },
        )
      }
      if (levelPoints >= 40 && levelPoints < 60) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'ADVANCED',
            },
          },
        )
      }
      if (levelPoints >= 60) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'MASTER',
            },
          },
        )
      }

      const { modifiedCount } = await assignmentData.updateOne(
        { _id: new ObjectId(readingGuideId) },
        {
          $set: {
            'score.earnedPoints': effortPoints(
              readingGuideValidation.score.maxPoints,
            ),
            'effort': effort,
            reviewed: true,
            'readingGuideFinal.responsibilityPoints': effortPoints(
              readingGuideValidation.readingGuideFinal?.responsibilityPoints!!,
            ),
          },
        },
      )

      studentData.updateOne(
        {
          'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
          markingPeriod: readingGuideValidation.markingPeriod,
          responsibilityPoints: { $exists: true },
          behavior: { $exists: false },
        },
        {
          $inc: {
            responsibilityPoints:
              -readingGuideValidation.readingGuideFinal?.responsibilityPoints! +
              effortPoints(
                readingGuideValidation.readingGuideFinal?.responsibilityPoints!,
              ),
          },
        },
      )

      return { reviewed: modifiedCount === 1 }
    } else throw new Error('Reading Guide Does Not Exist!')
  },
})
