import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const AddFieldsToReadingGuideInput = inputObjectType({
//     name: 'AddFieldsToReadingGuideInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const AddFieldsToReadingGuidePayload = objectType({
  name: 'AddFieldsToReadingGuidePayload',
  definition(t) {
    t.boolean('added')
  },
})

export const AddFieldsToReadingGuide = mutationField(
  'addFieldsToReadingGuide',
  {
    type: AddFieldsToReadingGuidePayload,
    // args: {
    //   input: arg({ type: AddFieldsToReadingGuideInput, required: true }),
    // },
    async resolve(_, __, { assignmentData }) {
      await assignmentData.updateMany(
        {
          workingDraft: { $exists: false },
          quizzableSections: { $exists: false },
        },
        { $set: { effort: 'GOOD_EFFORT' } }
      )
      return { added: true }
    },
  }
)
