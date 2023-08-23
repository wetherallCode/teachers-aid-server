import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuideReviewOptionsEnum } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { Student } from '../../students'

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
    { assignmentData, studentData }
  ) {
    const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] =
      await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })

    if (readingGuideValidation) {
      const points = readingGuideValidation.score.maxPoints
      const effortPoints =
        effort === 'GOOD_EFFORT'
          ? points * 1
          : effort === 'SOME_EFFORT'
          ? points * 0.75
          : effort === 'LITTLE_EFFORT'
          ? points * 0.5
          : 0

      const { modifiedCount: progressTrackerModifiedCount } =
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          { $inc: { 'readingGuideProgressTracker.levelPoints': 1 } }
        )

      const studentToLevelUp: NexusGenRootTypes['ProgressTracker'] =
        await studentData.findOne({
          'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
          readingGuideProgressTracker: { $exists: true },
        })

      const { levelPoints } = studentToLevelUp.readingGuideProgressTracker

      if (levelPoints >= 5 && levelPoints < 10) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'DEVELOPING',
            },
          }
        )
      }
      if (levelPoints >= 10 && levelPoints < 25) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'ACADEMIC',
            },
          }
        )
      }
      if (levelPoints >= 25 && levelPoints < 50) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'ADVANCED',
            },
          }
        )
      }
      if (levelPoints >= 50) {
        await studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            readingGuideProgressTracker: { $exists: true },
          },
          {
            $set: {
              'readingGuideProgressTracker.readingGuideLevel': 'MASTER',
            },
          }
        )
      }

      const { modifiedCount } = await assignmentData.updateOne(
        { _id: new ObjectId(readingGuideId) },
        {
          $set: {
            'score.earnedPoints': effortPoints,
            'effort': effort,
            reviewed: true,
          },
        }
      )

      return { reviewed: modifiedCount === 1 ? true : false }
    } else throw new Error('Reading Guide Does Not Exist!')
  },
})
