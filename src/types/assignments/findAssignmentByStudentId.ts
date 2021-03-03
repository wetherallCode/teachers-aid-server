import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Assignment } from '.'
import { ArticleReview } from './article-reviews'

export const FindAssignmentByStudentIdInput = inputObjectType({
  name: 'FindAssignmentByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindAssignmentByStudentIdPayload = objectType({
  name: 'FindAssignmentByStudentIdPayload',
  definition(t) {
    t.list.field('assignments', { type: Assignment })
    t.list.field('articleReviews', { type: ArticleReview })
  },
})

export const FindAssignmentByStudentId = queryField(
  'findAssignmentByStudentId',
  {
    type: FindAssignmentByStudentIdPayload,
    args: {
      input: arg({ type: FindAssignmentByStudentIdInput, required: true }),
    },
    async resolve(_, { input: { studentId } }, { assignmentData }) {
      const assignments = await assignmentData
        .find({
          'hasOwner._id': new ObjectId(studentId),
          articleTitle: { $exists: false },
        })
        .toArray()

      const articleReviews = await assignmentData
        .find({
          'hasOwner._id': new ObjectId(studentId),
          articleTitle: { $exists: true },
        })
        .toArray()
      return { assignments, articleReviews }
    },
  }
)
