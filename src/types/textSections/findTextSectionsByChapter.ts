import { inputObjectType, arg, queryField, objectType } from '@nexus/schema'
import { TextSection } from './textSection'
import { ObjectId } from 'mongodb'

export const FindTextSectionsByChapterInput = inputObjectType({
  name: 'FindTextSectionsByChapterInput',
  definition(t) {
    // t.string('fromText', { required: true })
    t.id('fromChapterId', { required: true })
  },
})

export const FindTextSectionsByChapterPayload = objectType({
  name: 'FindTextSectionsByChapterPayload',
  definition(t) {
    t.list.field('textSections', { type: TextSection })
  },
})

export const FindTextSectionsByChapter = queryField(
  'findTextSectionsByChapter',
  {
    type: FindTextSectionsByChapterPayload,
    args: {
      input: arg({ type: FindTextSectionsByChapterInput, required: true }),
    },
    async resolve(_, { input: { fromChapterId } }, { textData }) {
      const textSections = await textData
        .find({
          'fromChapter._id': new ObjectId(fromChapterId),
        })
        .toArray()

      return { textSections }
    },
  }
)
