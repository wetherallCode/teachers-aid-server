import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ArticleReview } from '.'
import { MarkingPeriodEnum } from '../../general'

export const FindArticleReviewsByStudentInput = inputObjectType({
  name: 'FindArticleReviewsByStudentInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const FindArticleReviewsByStudentPayload = objectType({
  name: 'FindArticleReviewsByStudentPayload',
  definition(t) {
    t.list.field('articleReviews', { type: ArticleReview })
  },
})

export const FindArticleReviewsByStudent = queryField(
  'findArticleReviewsByStudent',
  {
    type: FindArticleReviewsByStudentPayload,
    args: {
      input: arg({ type: FindArticleReviewsByStudentInput, required: true }),
    },
    async resolve(
      _,
      { input: { studentId, markingPeriod } },
      { assignmentData }
    ) {
      const articleReviews = await assignmentData
        .find({
          'hasOwner._id': new ObjectId(studentId),
          assigned: true,
          articleTitle: { $exists: true },
          markingPeriod,
        })
        .toArray()

      return { articleReviews }
    },
  }
)
