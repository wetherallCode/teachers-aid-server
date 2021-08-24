import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Text } from './text'

export const FindTextsPayload = objectType({
  name: 'FindTextsPayload',
  definition(t) {
    t.list.field('texts', { type: Text })
  },
})

export const FindTexts = queryField('findTexts', {
  type: FindTextsPayload,
  async resolve(_, __, { textData }) {
    const texts = await textData
      .find({ textTitle: { $exists: true } })
      .toArray()

    return { texts }
  },
})
