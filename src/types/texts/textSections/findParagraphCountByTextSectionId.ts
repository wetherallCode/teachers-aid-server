import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindParagraphCountByTextSectionIdInput = inputObjectType({
  name: 'FindParagraphCountByTextSectionIdInput',
  definition(t) {
    t.list.string('sectionIds', { required: true })
  },
})

export const FindParagraphCountByTextSectionIdPayload = objectType({
  name: 'FindParagraphCountByTextSectionIdPayload',
  definition(t) {
    t.int('paragraphCount')
  },
})

export const FindParagraphCountByTextSectionId = queryField(
  'findParagraphCountByTextSectionId',
  {
    type: FindParagraphCountByTextSectionIdPayload,
    args: {
      input: arg({
        type: FindParagraphCountByTextSectionIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { sectionIds } }, { textData }) {
      let paragraphCount = 0
      for (const id of sectionIds) {
        const textSection: NexusGenRootTypes['TextSection'] =
          await textData.findOne({ _id: new ObjectId(id) })
        paragraphCount += textSection.numberOfParagraphs
      }
      return { paragraphCount }
    },
  },
)
