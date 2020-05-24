import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, LessonTextSectionsInput } from '.'
import { MarkingPeriodEnum } from '../general'
import {
  TextSectionProtocolsInput,
  TextSectionQuestionsInput,
  TextSectionVocabInput,
} from '../textSections'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateLessonInput = inputObjectType({
  name: 'CreateLessonInput',
  definition(t) {
    t.date('assignedDate', { required: true })
    t.field('assignedMarkingPeriod', {
      type: MarkingPeriodEnum,
      required: true,
    })
    t.list.id('assignedCourse', { required: true })
    t.field('assignedSections', {
      type: LessonTextSectionsInput,
      required: true,
    })
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
        assignedMarkingPeriod,
        assignedCourse,
        assignedSections,
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
    const lessons = []
    for (const _id in assignedCourse) {
      const course = await courseData.findOne({
        _id: new ObjectId(assignedCourse[_id]),
      })

      const lesson: NexusGenRootTypes['Lesson'] = {
        assignedDate,
        assignedMarkingPeriod,
        assignedCourse: course,
        assignedSections,
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
