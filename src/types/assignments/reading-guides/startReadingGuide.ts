import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ReadingGuide } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const StartReadingGuideInput = inputObjectType({
  name: 'StartReadingGuideInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    t.boolean('paperBased', { required: true })
  },
})

export const StartReadingGuidePayload = objectType({
  name: 'StartReadingGuidePayload',
  definition(t) {
    t.field('readingGuide', { type: ReadingGuide })
  },
})

export const StartReadingGuide = mutationField('startReadingGuide', {
  type: StartReadingGuidePayload,
  args: { input: arg({ type: StartReadingGuideInput, required: true }) },
  async resolve(
    _,
    { input: { readingGuideId, paperBased } },
    { assignmentData }
  ) {
    const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] =
      await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })

    if (readingGuideValidation) {
      if (!readingGuideValidation.readingGuideFinal) {
        if (paperBased) {
          assignmentData.updateOne(
            {
              _id: new ObjectId(readingGuideId),
            },
            {
              $set: {
                assigned: false,
                paperBased,
              },
            }
          )
        }

        if (!paperBased) {
          assignmentData.updateOne(
            {
              _id: new ObjectId(readingGuideId),
            },
            {
              $set: {
                readingGuideFinal: {
                  submitted: false,
                  submitTime: '',
                  responsibilityPoints: 0,
                  readingGuideQuestions: [],
                },
              },
            }
          )
        }
        const readingGuide = await assignmentData.findOne({
          _id: new ObjectId(readingGuideId),
        })
        return { readingGuide }
      } else throw new Error('Already started')
    } else throw new Error('Reading Guide does not exist.')
  },
})
