import { inputObjectType } from '@nexus/schema'
import {
  TextSectionProtocolsInput,
  VocabInput,
  TextSectionQuestionsInput,
} from '.'

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
    t.list.field('hasQuestions', { type: TextSectionQuestionsInput })
  },
})
