import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Lesson, LessonTextSectionsInput } from '.'
import { ObjectId } from 'mongodb'
import {
  MarkingPeriodEnum,
  TextSectionVocabInput,
  TextSectionProtocolsInput,
  TextSectionQuestionsInput,
} from '..'

export const UpdateLessonInput = inputObjectType({
  name: 'UpdateLessonInput',
  definition(t) {
    t.id('_id', { required: true })
    t.date('assignedDate', { required: true })
    t.id('inUnit', { required: true })
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

export const UpdateLessonPayload = objectType({
  name: 'UpdateLessonPayload',
  definition(t) {
    t.field('lesson', { type: Lesson })
  },
})

export const UpdateLesson = mutationField('updateLesson', {
  type: UpdateLessonPayload,
  args: { input: arg({ type: UpdateLessonInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        _id,
        assignedDate,
        inUnit,
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
    { lessonData }
  ) {
    const unit = await lessonData.findOne({
      'inUnit._id': new ObjectId(inUnit),
    })
    await lessonData.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          assignedDate,
          inUnit: unit,
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
      }
    )
    const lesson = await lessonData.findOne({ _id: new ObjectId(_id) })
    return { lesson }
  },
})
