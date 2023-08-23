import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const AddReadingGuideQuestionInput = inputObjectType({
  name: 'AddReadingGuideQuestionInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    t.string('questionType')
  },
})

export const AddReadingGuideQuestionPayload = objectType({
  name: 'AddReadingGuideQuestionPayload',
  definition(t) {
    t.boolean('added')
  },
})

export const AddReadingGuideQuestion = mutationField(
  'addReadingGuideQuestion',
  {
    type: AddReadingGuideQuestionPayload,
    args: {
      input: arg({ type: AddReadingGuideQuestionInput, required: true }),
    },
    async resolve(
      _,
      { input: { readingGuideId, questionType } },
      { assignmentData }
    ) {
      assignmentData.updateOne(
        { _id: new ObjectId(readingGuideId) },
        {
          $push: {
            'readingGuideFinal.readingGuideQuestions': {
              questionType,
              answer: '',
            },
          },
        }
      )
    },
  }
)
