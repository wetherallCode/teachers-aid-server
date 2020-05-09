import { mutationField, inputObjectType, objectType, arg } from '@nexus/schema'
import { Chapter } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const AddNewChapterInput = inputObjectType({
  name: 'AddNewChapterInput',
  definition(t) {
    t.string('textTitle', { required: true })
    t.int('chapterNumber', { required: true })
    t.string('chapterTitle', { required: true })
  },
})

export const AddNewChapterPayload = objectType({
  name: 'AddNewChapterPayload',
  definition(t) {
    t.field('chapter', { type: Chapter })
  },
})

export const AddNewChapter = mutationField('addNewChapter', {
  type: AddNewChapterPayload,
  args: { input: arg({ type: AddNewChapterInput, required: true }) },
  async resolve(
    _,
    { input: { textTitle, chapterTitle, chapterNumber } },
    { textData }
  ) {
    const fromText = await textData.findOne({ textTitle })
    const newChapter: NexusGenRootTypes['Chapter'] = {
      chapterNumber,
      chapterTitle,
      fromText,
    }
    const { insertedId } = await textData.insertOne(newChapter)
    newChapter._id = insertedId

    return { chapter: newChapter }
  },
})
