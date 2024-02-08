import { enumType, objectType } from '@nexus/schema'
import { Course } from '../courses'
import { MarkingPeriodEnum } from '../general'
import { PageNumbers, TextSectionProtocols, TextSectionQuestions, TextSectionVocab } from '../texts/textSections'
import { LessonTextSections } from './lessonTextSections'
import { Unit } from '../units'
import { DynamicLessonEnums } from './dynamicLesson'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

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
    t.int('hasNumberOfParagraphs', {
      async resolve(parent, __, { textData }) {
        let numberOfParagraphs = 0

        for (const sectionId of parent.assignedSectionIdList) {
          const section: NexusGenRootTypes['TextSection'] = await textData.findOne({ _id: new ObjectId(sectionId) })
          numberOfParagraphs += section.numberOfParagraphs
        }
        return numberOfParagraphs
      },
    })
    t.list.field('vocabList', { type: TextSectionVocab })
    t.field('beforeActivity', { type: TextSectionProtocols })
    t.list.field('duringActivities', { type: TextSectionProtocols })
    t.int('protocolCount', { nullable: true })
    t.field('afterActivity', { type: TextSectionProtocols })
    t.list.field('questionList', { type: TextSectionQuestions })
    t.string('essentialQuestion')
    t.string('objectives', { nullable: true })
    t.field('dynamicLesson', { type: DynamicLessonEnums })
    t.list.string('lessonNotes', { nullable: true })
    t.field('lessonType', { type: LessonTypeEnum })
    t.boolean('lessonStarted')
  },
})

export const LessonTypeEnum = enumType({
  name: 'LessonTypeEnum',
  members: ['INTRODUCTORY', 'REINFORCEMENT'],
})
