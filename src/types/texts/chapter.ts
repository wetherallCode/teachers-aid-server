import { objectType, inputObjectType } from '@nexus/schema'
import { Text } from '.'
import { resolve } from 'dns'
import { TextSection } from '../textSections'

export const Chapter = objectType({
  name: 'Chapter',
  definition(t) {
    t.id('_id', { nullable: true })
    t.int('chapterNumber')
    t.string('chapterTitle')
    t.field('fromText', { type: Text })
    t.field('hasSections', {
      type: TextSection,
      async resolve(parent, __, { textData }) {
        const sections = await textData.find({ _id: parent._id }).toArray()
        return sections
      },
    })
  },
})

export const TextChapterInput = inputObjectType({
  name: 'TextChapterInput',
  definition(t) {
    t.int('chapterNumber', { required: true })
    t.string('chapterTitle', { required: true })
  },
})
