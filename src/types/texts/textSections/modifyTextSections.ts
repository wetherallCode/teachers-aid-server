import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const ModifyTextSectionsInput = inputObjectType({
//     name: 'ModifyTextSectionsInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const ModifyTextSectionsPayload = objectType({
  name: 'ModifyTextSectionsPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyTextSections = mutationField('modifyTextSections', {
  type: ModifyTextSectionsPayload,
  // args: { input: arg({ type: ModifyTextSectionsInput, required: true }) },
  async resolve(_, __, { textData }) {
    textData
    // const { modifiedCount } = textData.updateMany(
    //   { header: { $exists: true } },
    //   { $set: { numberOfParagraphs: 0 } }
    // )
    return { modified: true }
  },
})
