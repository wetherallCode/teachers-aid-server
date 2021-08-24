import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Chapter } from '.'
import { text } from 'express'
import { ObjectID } from 'mongodb'

export const FindChapterTitleInput = inputObjectType({
  name: 'FindChapterTitleInput',
  definition(t) {
    t.id('chapter_id', { required: true })
  },
})

export const FindChapterTitlePayload = objectType({
  name: 'FindChapterTitlePayload',
  definition(t) {
    t.field('chapter', { type: Chapter })
  },
})

export const FindChapterTitle = queryField('findChapterTitle', {
  type: FindChapterTitlePayload,
  args: { input: arg({ type: FindChapterTitleInput, required: true }) },
  async resolve(_, { input: { chapter_id } }, { textData }) {
    const chapter = await textData.findOne({ _id: new ObjectID(chapter_id) })

    return { chapter }
  },
})
