import { inputObjectType, arg, queryField, objectType } from '@nexus/schema'
import { TextSection } from './textSection'

export const FindTextSectionsByChapterInput = inputObjectType({
  name: 'FindTextSectionsByChapterInput',
  definition(t) {
    t.string('fromText', { required: true })
    t.string('fromChapter', { required: true })
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
    async resolve(
      _,
      { input: { fromText, fromChapter } },
      { textSectionData }
    ) {
      const textSections = await textSectionData
        .find({ fromText, fromChapter })
        .toArray()
      return { textSections }
    },
  }
)
