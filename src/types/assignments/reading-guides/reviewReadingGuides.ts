import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
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
  async resolve(_, { input: { readingGuideId, effort } }, { assignmentData }) {
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

      await assignmentData.updateOne(
        { _id: new ObjectId(readingGuideId) },
        {
          $set: { 'score.earnedPoints': effortPoints, reviewed: true },
        }
      )
      return { reviewed: true }
    } else throw new Error('Reading Guide Does Not Exist!')
  },
})
