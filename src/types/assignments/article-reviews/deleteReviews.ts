import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteReviewsInput = inputObjectType({
  name: 'DeleteReviewsInput',
  definition(t) {
    t.string('assignedDate', { required: true })
  },
})

export const DeleteReviewsPayload = objectType({
  name: 'DeleteReviewsPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteReviews = mutationField('deleteReviews', {
  type: DeleteReviewsPayload,
  args: { input: arg({ type: DeleteReviewsInput, required: true }) },
  async resolve(_, { input: { assignedDate } }, { assignmentData }) {
    const { deletedCount } = await assignmentData.deleteMany({
      assignedDate: assignedDate,
      articleTitle: { $exists: true },
    })
    console.log(deletedCount)
    // if (deletedCount === 1) {
    //   return { removed: true }
    // }
    return { removed: true }
  },
})
