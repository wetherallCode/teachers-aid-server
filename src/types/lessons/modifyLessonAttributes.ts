import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const ModifyLessonAttributesInput = inputObjectType({
//     name: 'ModifyLessonAttributesInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const ModifyLessonAttributesPayload = objectType({
  name: 'ModifyLessonAttributesPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyLessonAttributes = mutationField('modifyLessonAttributes', {
  type: ModifyLessonAttributesPayload,
  // args: { input: arg({ type: ModifyLessonAttributesInput, required: true }) },
  async resolve(_, __, { lessonData }) {
    await lessonData.updateMany(
      {},
      {
        $set: { lessonStarted: false },
      }
    )
    return { modified: true }
  },
})
