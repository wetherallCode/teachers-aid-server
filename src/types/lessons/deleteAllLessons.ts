import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const DeleteAllLessonsInput = inputObjectType({
//     name: 'DeleteAllLessonsInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const DeleteAllLessonsPayload = objectType({
  name: 'DeleteAllLessonsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllLessons = mutationField('deleteAllLessons', {
  type: DeleteAllLessonsPayload,
  // args: { input: arg({ type: DeleteAllLessonsInput, required: true }) },
  async resolve(_, __, { lessonData }) {
    const { deletedCount } = await lessonData.deleteMany()
    return { removed: true }
  },
})
