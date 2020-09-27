import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ArticleReview } from '.'

export const ReturnArticleReviewInput = inputObjectType({
  name: 'ReturnArticleReviewInput',
  definition(t) {
    t.id('articleReviewId', { required: true })
  },
})

export const ReturnArticleReviewPayload = objectType({
  name: 'ReturnArticleReviewPayload',
  definition(t) {
    t.field('articleReview', { type: ArticleReview })
  },
})

export const ReturnArticleReview = mutationField('returnArticleReview', {
  type: ReturnArticleReviewPayload,
  args: { input: arg({ type: ReturnArticleReviewInput, required: true }) },
  async resolve(_, { input: { articleReviewId } }, { assignmentData }) {
    const articleReviewCheck = await assignmentData.findOne({
      _id: new ObjectId(articleReviewId),
    })
    if (articleReviewCheck) {
      await assignmentData.updateOne(
        {
          _id: new ObjectId(articleReviewId),
        },
        {
          $set: { returned: true },
        }
      )
      const articleReview = await assignmentData.findOne({
        _id: new ObjectId(articleReviewId),
      })
      return { articleReview }
    } else throw new Error('ArticleReview does not exist')
  },
})
