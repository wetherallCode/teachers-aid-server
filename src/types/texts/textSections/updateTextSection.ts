import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import {
  TextSection,
  PageNumbersInput,
  TextSectionProtocolsInput,
  TextSectionVocabInput,
  TextSectionQuestionsInput,
} from '.'

export const UpdateTextSectionInput = inputObjectType({
  name: 'UpdateTextSectionInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('fromChapterId', { required: true })
    t.field('pageNumbers', { type: PageNumbersInput, required: true })
    t.string('header', { required: true })
    t.list.field('hasProtocols', {
      type: TextSectionProtocolsInput,
      required: true,
    })
    t.list.field('hasVocab', { type: TextSectionVocabInput, required: true })
    t.list.field('hasQuestions', {
      type: TextSectionQuestionsInput,
      required: true,
    })
  },
})

export const UpdateTextSectionPayload = objectType({
  name: 'UpdateTextSectionPayload',
  definition(t) {
    t.field('textSection', { type: TextSection })
  },
})

export const UpdateTextSection = mutationField('updateTextSection', {
  type: UpdateTextSectionPayload,
  args: { input: arg({ type: UpdateTextSectionInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        fromChapterId,
        _id,
        pageNumbers,
        header,
        hasProtocols,
        hasQuestions,
        hasVocab,
      },
    },
    { textData }
  ) {
    const chapter = await textData.findOne({ _id: new ObjectId(fromChapterId) })

    await textData.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          fromChapter: chapter,
          pageNumbers: pageNumbers,
          header: header,
          hasProtocols: hasProtocols,
          hasQuestions: hasQuestions,
          hasVocab: hasVocab,
        },
      }
    )
    const textSection = await textData.findOne({ _id: new ObjectId(_id) })

    return { textSection }
  },
})
