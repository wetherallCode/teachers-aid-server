import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ArticleReview } from '.'

export const UpdateArticleReviewInput = inputObjectType({
  name: 'UpdateArticleReviewInput',
  definition(t) {
    t.id('articleReviewId', { required: true })
    t.string('articleTitle', { required: true })
    t.string('articleAuthor', { required: true })
    t.string('publishedDate')
    t.string('articleLink', { required: true })
    t.string('issue', { required: true })
    t.boolean('bias')
    t.string('solutions')
    t.string('topicsImportance', { required: true })
  },
})

export const UpdateArticleReviewPayload = objectType({
  name: 'UpdateArticleReviewPayload',
  definition(t) {
    t.field('articleReview', { type: ArticleReview })
  },
})

export const UpdateArticleReview = mutationField('updateArticleReview', {
  type: UpdateArticleReviewPayload,
  args: { input: arg({ type: UpdateArticleReviewInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        articleReviewId,
        articleTitle,
        articleAuthor,
        publishedDate,
        articleLink,
        issue,
        bias,
        solutions,
        topicsImportance,
      },
    },
    { assignmentData }
  ) {
    const articleReviewCheck = await assignmentData.findOne({
      _id: new ObjectId(articleReviewId),
    })

    if (articleReviewCheck) {
      assignmentData.updateOne(
        { _id: new ObjectId(articleReviewId) },
        {
          $set: {
            articleTitle,
            articleAuthor,
            publishedDate,
            articleLink,
            issue,
            bias,
            solutions,
            topicsImportance,
          },
        }
      )

      const articleReview = await assignmentData.findOne({
        _id: new ObjectId(articleReviewId),
      })

      return { articleReview }
    } else throw new Error('ArticleReview does not exist.')
  },
})
