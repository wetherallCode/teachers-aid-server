import { objectType, inputObjectType } from '@nexus/schema'
import { Text } from '..'
import { TextSection } from '../textSections'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const Chapter = objectType({
  name: 'Chapter',
  definition(t) {
    t.id('_id', { nullable: true })
    t.int('chapterNumber')
    t.string('chapterTitle')
    t.field('fromText', { type: Text })
    t.list.field('hasSections', {
      type: TextSection,
      async resolve(parent, __, { textData }) {
        const sections: NexusGenRootTypes['TextSection'][] = await textData
          .find({
            'fromChapter._id': new ObjectId(parent._id!),
          })
          .toArray()
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
