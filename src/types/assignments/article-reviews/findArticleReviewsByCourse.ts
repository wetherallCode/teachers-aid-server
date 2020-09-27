import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ArticleReview } from '.'
import { MarkingPeriodEnum } from '../../general'

export const FindArticleReviewsByCourseInput = inputObjectType({
  name: 'FindArticleReviewsByCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})

export const FindArticleReviewsByCoursePayload = objectType({
  name: 'FindArticleReviewsByCoursePayload',
  definition(t) {
    t.list.field('articleReviews', { type: ArticleReview })
  },
})

export const FindArticleReviewsByCourse = queryField(
  'findArticleReviewsByCourse',
  {
    type: FindArticleReviewsByCoursePayload,
    args: {
      input: arg({ type: FindArticleReviewsByCourseInput, required: true }),
    },
    async resolve(
      _,
      { input: { courseId, markingPeriod } },
      { assignmentData }
    ) {
      const articleReviews: NexusGenRootTypes['ArticleReview'][] = await assignmentData
        .find({
          'hasOwner.inCourses._id': new ObjectId(courseId),
          articleTitle: { $exists: true },
          markingPeriod,
        })
        .toArray()

      return { articleReviews }
    },
  }
)
