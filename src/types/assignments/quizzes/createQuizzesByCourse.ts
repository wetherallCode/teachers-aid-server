import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { Quiz } from '.'
import { ReadingsInput } from '..'
import { MarkingPeriodEnum } from '../..'

export const CreateQuizzesByCourseInput = inputObjectType({
  name: 'CreateQuizzesByCourseInput',
  definition(t) {
    t.list.id('courseIds', { required: true })
    t.id('hasAssigner', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.id('associatedLessonId', { required: true })
    t.string('dueTime', { required: true })
    t.string('assignedDate', { required: true })
    t.string('dueDate', { required: true })
    t.field('readings', { type: ReadingsInput, required: true })
  },
})

export const CreateQuizzesByCoursePayload = objectType({
  name: 'CreateQuizzesByCoursePayload',
  definition(t) {
    t.list.field('quizzes', { type: Quiz })
  },
})

export const CreateQuizzesByCourse = mutationField('createQuizzesByCourse', {
  type: CreateQuizzesByCoursePayload,
  args: { input: arg({ type: CreateQuizzesByCourseInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        courseIds,
        assignedDate,
        dueDate,
        dueTime,
        hasAssigner,
        markingPeriod,
        readings,
        associatedLessonId,
      },
    },
    { assignmentData, userData, lessonData, questionData }
  ) {
    const teacher: NexusGenRootTypes['Teacher'] = await userData.findOne({
      _id: new ObjectId(hasAssigner),
    })

    const lessonInfo: NexusGenRootTypes['Lesson'] = lessonData.findOne({
      _id: new ObjectId(associatedLessonId!),
    })
    const quizzableSections = lessonInfo.assignedSectionIdList

    const quizzedSections = []

    const quizzes = []
    for (const section of quizzableSections) {
      const sectionToQuiz = await questionData.findOne({
        questionUsageType: 'QUIZ',
        associatedTextSectionId: section,
      })
      if (sectionToQuiz) {
        quizzedSections.push(sectionToQuiz)
      }
      // {questionUsageType: "QUIZ", associatedTextSectionId: "5f6b963e2f7ed60025fd6105"}
    }
    for (const courseId of courseIds) {
      const students: NexusGenRootTypes['Student'][] = await userData
        .find({ 'inCourses._id': new ObjectId(courseId) })
        .toArray()

      for (const student of students) {
        const quiz: NexusGenRootTypes['Quiz'] = {
          assigned: false,
          assignedDate,
          dueDate,
          dueTime,
          exempt: false,
          gradeType: 'SECONDARY',
          hasAssigner: teacher,
          hasOwner: student,
          late: false,
          markingPeriod,
          missing: true,
          paperBased: false,
          readings,
          score: {
            maxPoints: quizzedSections.length,
            earnedPoints: 0,
          },
          associatedLessonId,
          quizzableSections: quizzedSections,
          finishedQuiz: false,
          isActive: false,
        }
        const { insertedId } = await assignmentData.insertOne(quiz)
        quiz._id = insertedId
        quizzes.push(quiz)
      }
    }
    return { quizzes }
  },
})
