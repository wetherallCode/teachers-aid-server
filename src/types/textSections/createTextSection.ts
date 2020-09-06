import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import {
  TextSectionProtocolsInput,
  TextSectionVocab,
  TextSectionQuestionsInput,
} from '.'
import {
  TextSection,
  TextSectionVocabInput,
  PageNumbersInput,
} from './textSection'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateTextSectionInput = inputObjectType({
  name: 'CreateTextSectionInput',
  definition(t) {
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

export const CreateTextSectionPayload = objectType({
  name: 'CreateTextSectionPayload',
  definition(t) {
    t.field('textSection', { type: TextSection })
  },
})

export const CreateTextSection = mutationField('createTextSection', {
  type: CreateTextSectionPayload,
  args: { input: arg({ type: CreateTextSectionInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        fromChapterId,
        pageNumbers,
        header,
        hasProtocols,
        hasVocab,
        hasQuestions,
      },
    },
    { textData }
  ) {
    const chapter = await textData.findOne({ _id: new ObjectId(fromChapterId) })
    const newTextSection: NexusGenRootTypes['TextSection'] = {
      fromChapter: chapter,
      pageNumbers,
      header,
      hasProtocols,
      hasVocab,
      hasQuestions,
    }

    const { insertedId } = await textData.insertOne(newTextSection)
    newTextSection._id = insertedId

    return { textSection: newTextSection }
  },
})
