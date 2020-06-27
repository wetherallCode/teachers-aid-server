import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { TextSection } from '.'
import { ObjectID } from 'mongodb'

export const RemoveTextSectionInput = inputObjectType({
  name: 'RemoveTextSectionInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const RemoveTextSectionPayload = objectType({
  name: 'RemoveTextSectionPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveTextSection = mutationField('removeTextSection', {
  type: RemoveTextSectionPayload,
  args: { input: arg({ type: RemoveTextSectionInput, required: true }) },
  async resolve(_, { input: { _id } }, { textData }) {
    const doesTextSectionExist = await textData.findOne({
      _id: new ObjectID(_id),
    })
    if (doesTextSectionExist) {
      const { deletedCount } = await textData.deleteOne({
        _id: new ObjectID(_id),
      })
      if (deletedCount === 1) {
        return { removed: true }
      } else throw new Error('Something went wrong')
    } else throw new Error('Text Section does not exist!')
  },
})
