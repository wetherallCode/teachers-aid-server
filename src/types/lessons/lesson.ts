import { objectType } from '@nexus/schema'
import { Course } from '../courses'
import { MarkingPeriodEnum } from '../general'
import {
  TextSectionProtocols,
  TextSectionVocab,
  TextSectionQuestions,
  PageNumbers,
} from '../textSections'
import { LessonTextSections } from './lessonTextSections'
import { Unit } from '../units'
import { DynamicLessonEnums } from './dynamicLesson'

export const Lesson = objectType({
  name: 'Lesson',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('lessonName')
    t.date('assignedDate')
    t.field('inUnit', { type: Unit })
    t.field('assignedMarkingPeriod', { type: MarkingPeriodEnum })
    t.list.field('assignedCourses', { type: Course })
    t.field('pageNumbers', { type: PageNumbers })
    t.field('assignedSections', { type: LessonTextSections })
    t.list.id('assignedSectionIdList')
    t.list.field('vocabList', { type: TextSectionVocab })
    t.field('beforeActivity', { type: TextSectionProtocols })
    t.list.field('duringActivities', { type: TextSectionProtocols })
    t.field('afterActivity', { type: TextSectionProtocols })
    t.list.field('questionList', { type: TextSectionQuestions })
    t.string('essentialQuestion')
    t.string('objectives', { nullable: true })
    t.field('dynamicLesson', { type: DynamicLessonEnums })
  },
})
