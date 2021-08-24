import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { TextSection } from './textSection'
import { ObjectID } from 'mongodb'

export const ChangeVocabWordInput = inputObjectType({
  name: 'ChangeVocabWordInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('word', { required: true })
    t.string('newWord', { required: true })
    t.string('definition', { required: true })
    t.string('newDefinition', { required: true })
  },
})
export const ChangeVocabWordPayload = objectType({
  name: 'UpdateVocabPayload',
  definition(t) {
    t.field('textSection', { type: TextSection })
  },
})

export const ChangeVocabWord = mutationField('changeVocabWord', {
  type: ChangeVocabWordPayload,
  args: { input: arg({ type: ChangeVocabWordInput, required: true }) },
  async resolve(
    _,
    { input: { _id, newWord, word, definition, newDefinition } },
    { textData }
  ) {
    await textData.updateOne(
      {
        _id: new ObjectID(_id),
        hasVocab: { $elemMatch: { word: word, definition: definition } },
      },
      {
        $set: {
          'hasVocab.$.word': newWord,
          'hasVocab.$.definition': newDefinition,
        },
      }
    )
    const textSection = await textData.findOne({ _id: new ObjectID(_id) })
    return { textSection }
  },
})
