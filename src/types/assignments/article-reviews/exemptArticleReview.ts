import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ArticleReview } from '.'

export const ExemptArticleReviewInput = inputObjectType({
  name: 'ExemptArticleReviewInput',
  definition(t) {
    t.id('articleReviewId', { required: true })
  },
})

export const ExemptArticleReviewPayload = objectType({
  name: 'ExemptArticleReviewPayload',
  definition(t) {
    t.field('articleReview', { type: ArticleReview })
  },
})

export const ExemptArticleReview = mutationField('exemptArticleReview', {
  type: ExemptArticleReviewPayload,
  args: { input: arg({ type: ExemptArticleReviewInput, required: true }) },
  async resolve(_, { input: { articleReviewId } }, { assignmentData }) {
    const articleReviewCheck = await assignmentData.findOne({
      _id: new ObjectId(articleReviewId),
    })

    if (articleReviewCheck) {
      const articleReview = await assignmentData.findOne({
        _id: new ObjectId(articleReviewId),
      })

      await assignmentData.updateOne(
        { _id: new ObjectId(articleReviewId) },
        {
          $set: { exempt: true },
        }
      )
      return { articleReview: articleReview }
    } else throw new Error('Article Review does not exist')
  },
})
