import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ArticleReview } from '.'

export const GradeArticleReviewInput = inputObjectType({
  name: 'GradeArticleReviewInput',
  definition(t) {
    t.id('articleReviewId', { required: true })
    t.int('earnedPoints', { required: true })
  },
})

export const GradeArticleReviewPayload = objectType({
  name: 'GradeArticleReviewPayload',
  definition(t) {
    t.field('articleReview', { type: ArticleReview })
  },
})

export const GradeArticleReview = mutationField('gradeArticleReview', {
  type: GradeArticleReviewPayload,
  args: { input: arg({ type: GradeArticleReviewInput, required: true }) },
  async resolve(
    _,
    { input: { articleReviewId, earnedPoints } },
    { assignmentData }
  ) {
    const articleReviewCheck = await assignmentData.findOne({
      _id: new ObjectId(articleReviewId),
    })
    if (articleReviewCheck) {
      await assignmentData.updateOne(
        {
          _id: new ObjectId(articleReviewId),
        },
        {
          $set: { 'score.earnedPoints': earnedPoints },
        }
      )
      const articleReview = await assignmentData.findOne({
        _id: new ObjectId(articleReviewId),
      })
      return { articleReview }
    } else throw new Error('ArticleReview does not exist')
  },
})
