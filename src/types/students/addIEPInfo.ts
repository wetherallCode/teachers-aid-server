import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const AddIEPInfoInput = inputObjectType({
//     name: 'AddIEPInfoInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const AddIEPInfoPayload = objectType({
  name: 'AddIEPInfoPayload',
  definition(t) {
    t.boolean('added')
  },
})

export const AddIEPInfo = mutationField('addIEPInfo', {
  type: AddIEPInfoPayload,
  // args: { input: arg({ type: AddIEPInfoInput, required: true }) },
  async resolve(_, __, { userData }) {
    const students = await userData
      .find({ schoolId: { $exists: true } })
      .toArray()

    const { modifiedCount } = await userData.updateMany(
      {
        schoolId: { $exists: true },
      },
      { $set: { hasIEP: false } }
    )
    return { added: students.length === modifiedCount ? true : false }
  },
})
