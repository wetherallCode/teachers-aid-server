import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, LessonTextSectionsInput } from '.'
import { MarkingPeriodEnum } from '../general'
import {
  TextSectionProtocolsInput,
  TextSectionQuestionsInput,
  TextSectionVocabInput,
  PageNumbersInput,
} from '../textSections'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { UnitInput, CourseInput } from '..'

export const CreateLessonInput = inputObjectType({
  name: 'CreateLessonInput',
  definition(t) {
    t.date('assignedDate', { required: true })
    t.id('inUnit', { required: true })
    t.field('assignedMarkingPeriod', {
      type: MarkingPeriodEnum,
      required: true,
    })
    t.list.id('assignedCourses', { required: true })
    t.string('lessonName', { required: true })
    t.field('assignedSections', {
      type: LessonTextSectionsInput,
      required: true,
    })
    t.field('pageNumbers', { type: PageNumbersInput, required: true })
    t.list.id('assignedSectionIdList', { required: true })
    t.list.field('vocabList', { type: TextSectionVocabInput, required: true })
    t.field('beforeActivity', {
      type: TextSectionProtocolsInput,
      required: true,
    })
    t.list.field('duringActivities', {
      type: TextSectionProtocolsInput,
      required: true,
    })
    t.field('afterActivity', {
      type: TextSectionProtocolsInput,
      required: true,
    })
    t.list.field('questionList', {
      type: TextSectionQuestionsInput,
      required: true,
    })
    t.string('essentialQuestion', { required: true })
  },
})

export const CreateLessonPayload = objectType({
  name: 'CreateLessonPayload',
  definition(t) {
    t.list.field('lessons', { type: Lesson })
  },
})

export const CreateLesson = mutationField('createLesson', {
  type: CreateLessonPayload,
  args: { input: arg({ type: CreateLessonInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        assignedDate,
        inUnit,
        lessonName,
        assignedMarkingPeriod,
        assignedCourses,
        pageNumbers,
        assignedSections,
        assignedSectionIdList,
        vocabList,
        beforeActivity,
        duringActivities,
        afterActivity,
        questionList,
        essentialQuestion,
      },
    },
    { lessonData, courseData }
  ) {
    const lessons: NexusGenRootTypes['Lesson'][] = []
    const unit = await lessonData.findOne({ _id: new ObjectId(inUnit) })
    for (const _id in assignedCourses) {
      const course = await courseData.findOne({
        _id: new ObjectId(assignedCourses[_id]),
      })

      const lesson: NexusGenRootTypes['Lesson'] = {
        assignedDate,
        inUnit: unit,
        assignedMarkingPeriod,
        lessonName,
        pageNumbers,
        assignedCourse: course,
        linkedCourseIds: assignedCourses,
        assignedSections,
        assignedSectionIdList,
        vocabList,
        beforeActivity,
        duringActivities,
        afterActivity,
        essentialQuestion,
        questionList,
        objectives: null,
      }

      const { insertedId } = await lessonData.insertOne(lesson)
      lesson._id = insertedId
      lessons.unshift(lesson)
    }
    return { lessons }
  },
})
