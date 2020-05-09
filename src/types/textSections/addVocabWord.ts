import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { TextSection } from '.'
import { ObjectID } from 'mongodb'

export const AddVocabWordInput = inputObjectType({
  name: 'AddVocabWordInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('word', { required: true })
    t.string('definition', { required: true })
    t.int('position', { required: true })
  },
})

export const AddVocabWordPayload = objectType({
  name: 'AddVocabWordPayload',
  definition(t) {
    t.field('textSection', { type: TextSection })
  },
})

export const AddVocabWord = mutationField('addVocabWord', {
  type: AddVocabWordPayload,
  args: { input: arg({ type: AddVocabWordInput, required: true }) },
  async resolve(
    _,
    { input: { _id, word, definition, position } },
    { textData }
  ) {
    await textData.updateOne(
      { _id: new ObjectID(_id) },
      {
        $push: {
          hasVocab: { $each: [{ word, definition }], $position: position },
        },
      }
    )
    const textSection = await textData.findOne({ _id: new ObjectID(_id) })
    return { textSection }
  },
})
