import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import {
  TextSectionProtocolsInput,
  VocabInput,
  TextSectionQuestionsInput,
} from '.'
import { TextSection } from './textSection'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const CreateTextSectionInput = inputObjectType({
  name: 'CreateTextSectionInput',
  definition(t) {
    t.string('fromText', { required: true })
    t.string('pages', { required: true })
    t.string('header', { required: true })
    t.list.field('hasProtocols', {
      type: TextSectionProtocolsInput,
      required: true,
    })
    t.list.field('vocab', { type: VocabInput, required: true })
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
    { input: { fromText, pages, header, hasProtocols, vocab, hasQuestions } },
    { textSectionData }
  ) {
    const newTextSection: NexusGenRootTypes['TextSection'] = {
      fromText,
      pages,
      header,
      hasProtocols,
      vocab,
      hasQuestions,
    }

    const { insertedId } = await textSectionData.insertOne(newTextSection)
    newTextSection._id = insertedId

    return { textSection: newTextSection }
  },
})
