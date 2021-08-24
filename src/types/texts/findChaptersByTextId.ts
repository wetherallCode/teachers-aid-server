import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { Chapter } from '.'

export const FindChaptersByTextIdInput = inputObjectType({
  name: 'FindChaptersByTextIdInput',
  definition(t) {
    t.id('textId', { required: true })
  },
})

export const FindChaptersByTextIdPayload = objectType({
  name: 'FindChaptersByTextIdPayload',
  definition(t) {
    t.list.field('chapters', { type: Chapter })
  },
})

export const FindChaptersByTextId = queryField('findChaptersByTextId', {
  type: FindChaptersByTextIdPayload,
  args: { input: arg({ type: FindChaptersByTextIdInput, required: true }) },
  async resolve(_, { input: { textId } }, { textData }) {
    const textCheck = await textData.findOne({
      textTitle: { $exists: true },
      _id: new ObjectId(textId),
    })
    if (textCheck) {
      const chapters: NexusGenRootTypes['Chapter'][] = await textData
        .find({
          chapterTitle: { $exists: true },
          'fromText._id': new ObjectId(textId),
        })
        .toArray()
      // console.log(chapters.map((chapter) => ))
      return { chapters }
    } else throw new Error('Text not found.')
  },
})
