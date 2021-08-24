import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Chapter } from '.'

export const FindChaptersInTextInput = inputObjectType({
  name: 'FindChaptersInTextInput',
  definition(t) {
    t.string('textTitle', { required: true })
  },
})

export const FindChaptersInTextPayload = objectType({
  name: 'FindChaptersInTextPayload',
  definition(t) {
    t.list.field('chapters', { type: Chapter })
  },
})

export const FindChaptersInText = queryField('findChaptersInText', {
  type: FindChaptersInTextPayload,
  args: { input: arg({ type: FindChaptersInTextInput, required: true }) },
  async resolve(_, { input: { textTitle } }, { textData }) {
    const chapters = await textData
      .find({ 'fromText.textTitle': textTitle })
      .toArray()

    return { chapters }
  },
})
