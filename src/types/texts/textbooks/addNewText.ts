import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { Text } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const AddNewTextInput = inputObjectType({
  name: 'AddNewTextInput',
  definition(t) {
    t.string('textTitle', { required: true })
    t.id('ownerId', { required: true })
  },
})

export const AddNewTextPayload = objectType({
  name: 'AddNewTextPayload',
  definition(t) {
    t.field('text', { type: Text })
  },
})

export const AddNewText = mutationField('addNewText', {
  type: AddNewTextPayload,
  args: { input: arg({ type: AddNewTextInput, required: true }) },
  async resolve(_, { input: { textTitle, ownerId } }, { textData }) {
    const newText: NexusGenRootTypes['Text'] = {
      ownerId,
      textTitle,
    }
    const { insertedId } = await textData.insertOne(newText)
    newText._id = insertedId
    return { text: newText }
  },
})
