import { objectType, inputObjectType } from '@nexus/schema'
import { Chapter } from '.'

export const Text = objectType({
  name: 'Text',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('textTitle')
    t.id('ownerId')
    t.list.field('hasChapters', {
      type: Chapter,
      async resolve(parent, __, { textData }) {
        const chapters = await textData
          .find({ 'fromText.textTitle': parent.textTitle })
          .toArray()
        return chapters
      },
    })
  },
})

export const TextInput = inputObjectType({
  name: 'TextInput',
  definition(t) {
    t.string('textTitle', { required: true })
    t.list.string('chapters', { required: true })
  },
})
