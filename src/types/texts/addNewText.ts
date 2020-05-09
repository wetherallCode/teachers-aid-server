import {
  inputObjectType,
  objectType,
  queryField,
  arg,
  mutationField,
} from '@nexus/schema'
import { Text } from '../texts'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const AddNewTextInput = inputObjectType({
  name: 'AddNewTextInput',
  definition(t) {
    t.string('textTitle', { required: true })
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
  async resolve(_, { input: { textTitle } }, { textData }) {
    const newText: NexusGenRootTypes['Text'] = {
      textTitle,
    }
    const { insertedId } = await textData.insertOne(newText)
    newText._id = insertedId
    return { text: newText }
  },
})
