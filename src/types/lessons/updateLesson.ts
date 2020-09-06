import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, LessonTextSectionsInput } from '.'
import { ObjectId } from 'mongodb'
import {
  MarkingPeriodEnum,
  TextSectionVocabInput,
  TextSectionProtocolsInput,
  TextSectionQuestionsInput,
  PageNumbersInput,
} from '..'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const UpdateLessonInput = inputObjectType({
  name: 'UpdateLessonInput',
  definition(t) {
    t.date('assignedDate', { required: true })
    t.id('inUnit', { required: true })
    t.field('assignedMarkingPeriod', {
      type: MarkingPeriodEnum,
      required: true,
    })
    t.list.id('linkedCourseIds', { required: true })
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

export const UpdateLessonPayload = objectType({
  name: 'UpdateLessonPayload',
  definition(t) {
    t.list.field('lessons', { type: Lesson })
  },
})

export const UpdateLesson = mutationField('updateLesson', {
  type: UpdateLessonPayload,
  args: { input: arg({ type: UpdateLessonInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        assignedDate,
        inUnit,
        lessonName,
        assignedMarkingPeriod,
        linkedCourseIds,
        assignedSections,
        pageNumbers,
        assignedSectionIdList,
        vocabList,
        beforeActivity,
        duringActivities,
        afterActivity,
        questionList,
        essentialQuestion,
      },
    },
    { lessonData }
  ) {
    const unit: NexusGenRootTypes['Unit'] = await lessonData.findOne({
      _id: new ObjectId(inUnit),
    })
    for (const _id in linkedCourseIds) {
      await lessonData.updateOne(
        {
          'assignedCourses._id': new ObjectId(linkedCourseIds[_id]),
          lessonName,
        },
        {
          $set: {
            assignedDate,
            inUnit: unit,
            assignedMarkingPeriod,
            assignedSections,
            pageNumbers,
            linkedCourseIds,
            assignedSectionIdList,
            vocabList,
            beforeActivity,
            duringActivities,
            afterActivity,
            questionList,
            essentialQuestion,
          },
        }
      )
    }

    const lessons: NexusGenRootTypes['Lesson'][] = []

    for (const _id in linkedCourseIds) {
      const lesson: NexusGenRootTypes['Lesson'] = await lessonData.findOne({
        'assignedCourses._id': new ObjectId(linkedCourseIds[_id]),
        lessonName,
      })
      lessons.unshift(lesson)
    }
    return { lessons }
  },
})
