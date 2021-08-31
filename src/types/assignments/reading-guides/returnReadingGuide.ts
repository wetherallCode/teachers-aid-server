import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuide } from '.'

export const ReturnReadingGuideInput = inputObjectType({
  name: 'ReturnReadingGuideInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    t.int('score', { required: true })
  },
})

export const ReturnReadingGuidePayload = objectType({
  name: 'ReturnReadingGuidePayload',
  definition(t) {
    t.field('readingGuide', { type: ReadingGuide })
  },
})

export const ReturnReadingGuide = mutationField('returnReadingGuide', {
  type: ReturnReadingGuidePayload,
  args: { input: arg({ type: ReturnReadingGuideInput, required: true }) },
  async resolve(_, { input: { readingGuideId, score } }, { assignmentData }) {
    const readingGuideValidation = await assignmentData.findOne({
      _id: new ObjectId(readingGuideId),
    })

    if (readingGuideValidation) {
      assignmentData.updateOne(
        {
          _id: new ObjectId(readingGuideId),
        },
        {
          $set: {
            'score.earnedPoints': score,
            'readingGuideFinal.returned': true,
            'readingGuideFinal.graded': true,
            missing: false,
          },
        }
      )
      const readingGuide = await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })

      return { readingGuide }
    } else throw new Error('Reading Guide does not exist.')
  },
})
