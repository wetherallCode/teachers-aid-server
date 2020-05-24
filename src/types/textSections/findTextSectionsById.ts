import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { TextSection } from '.'
import { ObjectId } from 'mongodb'

export const FindTextSectionsByIdInput = inputObjectType({
  name: 'FindTextSectionsByIdInput',
  definition(t) {
    t.list.id('_ids', { required: true })
  },
})

export const FindTextSectionsByIdPayload = objectType({
  name: 'FindTextSectionsByIdPayload',
  definition(t) {
    t.list.field('textSections', { type: TextSection })
  },
})

export const FindTextSectionsById = queryField('findTextSectionsById', {
  type: FindTextSectionsByIdPayload,
  args: { input: arg({ type: FindTextSectionsByIdInput, required: true }) },
  async resolve(_, { input: { _ids } }, { textData }) {
    const textSections = []
    for (const _id in _ids) {
      const section = await textData.findOne({ _id: new ObjectId(_ids[_id]) })
      textSections.push(section)
    }
    return { textSections }
  },
})
