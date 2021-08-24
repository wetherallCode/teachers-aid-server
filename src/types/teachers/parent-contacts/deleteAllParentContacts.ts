import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllParentContactsPayload = objectType({
  name: 'DeleteAllParentContactsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllParentContacts = mutationField(
  'deleteAllParentContacts',
  {
    type: DeleteAllParentContactsPayload,

    async resolve(_, __, { teacherData }) {
      const { deletedCount } = await teacherData.deleteMany({
        contentOfContact: { $exists: true },
      })
      console.log(deletedCount)
      // if (deletedCount === 1) {
      //   return { removed: true }
      // }
      return { removed: true }
    },
  }
)
