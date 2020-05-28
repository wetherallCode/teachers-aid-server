import { objectType, inputObjectType } from '@nexus/schema'
import { Course } from '../courses'
import { MarkingPeriodEnum } from '../general'
import {
  TextSectionProtocols,
  TextSectionVocab,
  TextSectionQuestions,
} from '../textSections'
import { LessonTextSections } from './lessonTextSections'
import { Unit } from '../units'

export const Lesson = objectType({
  name: 'Lesson',
  definition(t) {
    t.id('_id', { nullable: true })
    t.date('assignedDate')
    t.field('inUnit', { type: Unit })
    t.field('assignedMarkingPeriod', { type: MarkingPeriodEnum })
    t.field('assignedCourse', { type: Course })
    t.field('assignedSections', { type: LessonTextSections })
    t.list.field('vocabList', { type: TextSectionVocab })
    t.field('beforeActivity', { type: TextSectionProtocols })
    t.list.field('duringActivities', { type: TextSectionProtocols })
    t.field('afterActivity', { type: TextSectionProtocols })
    t.list.field('questionList', { type: TextSectionQuestions })
    t.string('essentialQuestion')
    t.string('objectives', { nullable: true })
  },
})
