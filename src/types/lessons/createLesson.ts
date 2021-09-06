import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, LessonTextSectionsInput, LessonTypeEnum } from '.'
import { MarkingPeriodEnum } from '../general'
import {
  TextSectionProtocolsInput,
  TextSectionQuestionsInput,
  TextSectionVocabInput,
  PageNumbersInput,
} from '../texts/textSections'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

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
    t.field('lessonType', { type: LessonTypeEnum, required: true })
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
        lessonType,
      },
    },
    { lessonData, courseData }
  ) {
    const unit = await lessonData.findOne({ _id: new ObjectId(inUnit) })

    const lessons: NexusGenRootTypes['Lesson'][] = []
    for (const courseId of assignedCourses) {
      const course = await courseData.findOne({
        _id: new ObjectId(courseId),
      })
      // courses.push(course)

      const lesson: NexusGenRootTypes['Lesson'] = {
        assignedDate,
        inUnit: unit,
        assignedMarkingPeriod,
        lessonName,
        pageNumbers,
        assignedCourses: [course],
        assignedSections,
        assignedSectionIdList,
        vocabList,
        beforeActivity,
        duringActivities,
        afterActivity,
        essentialQuestion,
        questionList,
        objectives: null,
        dynamicLesson: 'OFF',
        lessonType,
      }

      const { insertedId } = await lessonData.insertOne(lesson)
      lesson._id = insertedId
      lessons.push(lesson)
    }
    return { lessons }
  },
})
