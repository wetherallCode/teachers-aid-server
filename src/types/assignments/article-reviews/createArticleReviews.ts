import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ArticleReview } from '.'
import { TimeOfDayEnum } from '..'
import { MarkingPeriodEnum } from '../..'

export const CreateArticleReviewsInput = inputObjectType({
  name: 'CreateArticleReviewsInput',
  definition(t) {
    t.string('hasAssignerId', { required: true })
    t.list.id('assignedCourseId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    // t.int('maxPoints', { required: true })
    t.string('dueDate', { required: true })
    t.field('dueTime', { type: TimeOfDayEnum, required: true })
    t.string('assignedDate', { required: true })
  },
})

export const CreateArticleReviewsPayload = objectType({
  name: 'CreateArticleReviewsPayload',
  definition(t) {
    t.list.field('articleReviews', { type: ArticleReview })
  },
})

export const CreateArticleReviews = mutationField('createArticleReviews', {
  type: CreateArticleReviewsPayload,
  args: { input: arg({ type: CreateArticleReviewsInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        hasAssignerId,
        assignedCourseId,
        dueDate,
        // dueTime,
        assignedDate,
        markingPeriod,
      },
    },
    {
      userData,
      assignmentData,
      // courseData,
      studentData,
    }
  ) {
    console.log(new Date().toISOString().substring(17, 20))
    const assigner: NexusGenRootTypes['Teacher'] = await userData.findOne({
      _id: new ObjectId(hasAssignerId),
    })
    const studentList: NexusGenRootTypes['Student'][] = []

    for (const _id of assignedCourseId) {
      const students: NexusGenRootTypes['Student'][] = await userData
        .find({
          'inCourses._id': new ObjectId(_id),
        })
        .toArray()

      for (const student of students) {
        studentList.push(student)
      }
    }

    const newArticleReviews: NexusGenRootTypes['ArticleReview'][] = []
    // let i = 0
    for (const student of studentList) {
      const newArticleReview: NexusGenRootTypes['ArticleReview'] = {
        articleAuthor: '',
        articleLink: '',
        articleTitle: '',
        publishedDate: '',
        assigned: true,
        bias: null,
        issue: '',
        solutions: '',
        topicsImportance: '',
        assignedDate,
        dueDate,
        // dueTime: dueTimeForAssignment,
        dueTime: '8:00:00 AM',
        exempt: false,
        hasAssigner: assigner,
        hasOwner: student,
        late: true,
        markingPeriod,
        paperBased: false,
        score: {
          earnedPoints: 0,
          maxPoints: 10,
        },
        completed: false,
        submitted: false,
        returned: false,
      }

      await studentData.updateOne(
        {
          'student._id': new ObjectId(student._id!),
          markingPeriod,
          responsibilityPoints: { $exists: true },
        },
        {
          $inc: { responsibilityPoints: -2 },
        }
      )

      const { insertedId } = await assignmentData.insertOne(newArticleReview)
      newArticleReview._id = insertedId
      newArticleReviews.push(newArticleReview)
    }
    console.log(new Date().toISOString().substring(17, 20))
    return { articleReviews: newArticleReviews }
  },
})
