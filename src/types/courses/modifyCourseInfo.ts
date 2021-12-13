import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const ModifyCourseInfoPayload = objectType({
  name: 'ModifyCourseInfoPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyCourseInfo = mutationField('modifyCourseInfo', {
  type: ModifyCourseInfoPayload,
  // args: { input: arg({ type: ModifyCourseInfoInput, required: true }) },
  async resolve(_, __, { courseData }) {
    await courseData.updateMany(
      { startsAt: { $exists: true } },
      { $set: { assignmentsInClassNotAllowed: true } }
    )
    return { modified: true }
  },
})
