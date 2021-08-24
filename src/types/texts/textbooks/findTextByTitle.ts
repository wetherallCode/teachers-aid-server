import { inputObjectType, objectType, queryField, arg } from '@nexus/schema'
import { Text } from '../textbooks'

export const FindTextByTitleInput = inputObjectType({
  name: 'FindTextByTitleInput',
  definition(t) {
    t.string('title')
  },
})

export const FindTextByTitlePayload = objectType({
  name: 'FindTextByTitlePayload',
  definition(t) {
    t.field('text', { type: Text })
  },
})

export const FindTextByTitle = queryField('findTextByTitle', {
  type: FindTextByTitlePayload,
  args: { input: arg({ type: FindTextByTitleInput, required: true }) },
  async resolve(_, { input: { title } }, { textData }) {
    const text = await textData.findOne({ title })
    return { text }
  },
})
