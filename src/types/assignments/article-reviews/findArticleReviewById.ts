import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ArticleReview } from '.'

export const FindArticleReviewByIdInput = inputObjectType({
  name: 'FindArticleReviewByIdInput',
  definition(t) {
    t.id('articleReviewId', { required: true })
  },
})

export const FindArticleReviewByIdPayload = objectType({
  name: 'FindArticleReviewByIdPayload',
  definition(t) {
    t.field('articleReview', { type: ArticleReview })
  },
})

export const FindArticleReviewById = queryField('findArticleReviewById', {
  type: FindArticleReviewByIdPayload,
  args: { input: arg({ type: FindArticleReviewByIdInput, required: true }) },
  async resolve(_, { input: { articleReviewId } }, { assignmentData }) {
    const articleReviewCheck = await assignmentData.findOne({
      _id: new ObjectId(articleReviewId),
    })
    if (articleReviewCheck) {
      return { articleReview: articleReviewCheck }
    } else throw new Error('ArticleReview does not exist')
  },
})
