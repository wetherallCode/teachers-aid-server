import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuide } from '.'

export const FindReadingGuideByIdInput = inputObjectType({
  name: 'FindReadingGuideByIdInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
  },
})

export const FindReadingGuideByIdPayload = objectType({
  name: 'FindReadingGuideByIdPayload',
  definition(t) {
    t.field('readingGuide', { type: ReadingGuide })
  },
})

export const FindReadingGuideById = queryField('findReadingGuideById', {
  type: FindReadingGuideByIdPayload,
  args: { input: arg({ type: FindReadingGuideByIdInput, required: true }) },
  async resolve(_, { input: { readingGuideId } }, { assignmentData }) {
    console.log(readingGuideId)
    const readingGuide = await assignmentData.findOne({
      _id: new ObjectId(readingGuideId),
    })
    return { readingGuide }
  },
})
