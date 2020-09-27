import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ArticleReview } from '.'
import { MarkingPeriodEnum } from '../../general'

export const SubmitArticleReviewInput = inputObjectType({
  name: 'SubmitArticleReviewInput',
  definition(t) {
    t.id('articleReviewId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const SubmitArticleReviewPayload = objectType({
  name: 'SubmitArticleReviewPayload',
  definition(t) {
    t.field('articleReview', { type: ArticleReview })
  },
})

export const SubmitArticleReview = mutationField('submitArticleReview', {
  type: SubmitArticleReviewPayload,
  args: { input: arg({ type: SubmitArticleReviewInput, required: true }) },
  async resolve(
    _,
    { input: { articleReviewId, markingPeriod } },
    { assignmentData, studentData }
  ) {
    const articleReviewCheck: NexusGenRootTypes['ArticleReview'] = await assignmentData.findOne(
      {
        _id: new ObjectId(articleReviewId),
      }
    )
    function handleLateness() {
      const submittedDateTime: string = new Date().toLocaleString()
      const dueDateTime: string = `${articleReviewCheck.dueDate}, ${articleReviewCheck.dueTime}`

      if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
        return true
      } else return false
    }
    const articleReviewComplete: boolean =
      articleReviewCheck.articleTitle !== '' &&
      articleReviewCheck.articleAuthor !== '' &&
      articleReviewCheck.articleLink !== '' &&
      articleReviewCheck.issue !== '' &&
      articleReviewCheck.topicsImportance !== ''

    if (articleReviewCheck) {
      await assignmentData.updateOne(
        { _id: new ObjectId(articleReviewId) },
        {
          $set: {
            submitted: true,
            assigned: false,
            completed: true,
            late: handleLateness(),
            'score.earnedPoints': articleReviewComplete ? 10 : 6,
          },
        }
      )
      //   update responsibility points
      await studentData.updateOne(
        {
          'student._id': new ObjectId(articleReviewCheck.hasOwner._id!),
          markingPeriod,
          responsibilityPoints: { $exists: true },
        },
        {
          $inc: { responsibilityPoints: handleLateness() ? 4 : 3 },
        }
      )

      const articleReview = await assignmentData.findOne({
        _id: new ObjectId(articleReviewId),
      })

      return { articleReview }
    } else throw new Error('ArticleReview does not exist.')
  },
})
