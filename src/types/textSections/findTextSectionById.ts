import { inputObjectType, objectType, arg, queryField } from '@nexus/schema'
import { TextSection } from './textSection'
import { ObjectID } from 'mongodb'

export const FindTextSectionByIdInput = inputObjectType({
  name: 'FindTextSectionByIdInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const FindTextSectionByIdPayload = objectType({
  name: 'FindTextSectionByIdPayload',
  definition(t) {
    t.field('textSection', { type: TextSection })
  },
})

export const FindTextSectionById = queryField('findTextSectionById', {
  type: FindTextSectionByIdPayload,
  args: { input: arg({ type: FindTextSectionByIdInput, required: true }) },
  async resolve(_, { input: { _id } }, { textSectionData }) {
    const textSection = await textSectionData.findOne({
      _id: new ObjectID(_id),
    })
    return { textSection }
  },
})
