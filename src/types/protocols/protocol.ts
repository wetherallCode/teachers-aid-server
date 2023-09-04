import { enumType, objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'
import {
  AcademicOutcomeTypes,
  ProtocolActivityTypes,
} from '../texts/textSections'
import { Student, User } from '..'

export const Protocol = objectType({
  name: 'Protocol',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.list.field('partners', { type: Student, nullable: true })
    t.field('discussionLevel', { type: DiscussionTypesEnum, nullable: true })
    t.boolean('isActive')
    t.field('assessment', { type: ProtocolAssessmentEnum, nullable: true })
    t.boolean('completed')
    t.field('protocolActivityType', { type: ProtocolActivityTypes })
    t.field('academicOutcomeType', { type: AcademicOutcomeTypes })
    t.string('task')
    t.string('assignedDate')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.string('startTime')
    t.string('endTime', { nullable: true })
    t.string('response', { nullable: true })
    t.int('lastScore')
    t.string('lessonId')
    t.field('activityTime', { type: ActivityTimeEnum })
  },
})

export const DiscussionTypesEnum = enumType({
  name: 'DiscussionTypesEnum',
  members: [
    'NOT_REQUIRED',
    'LITTLE_TO_NO_DISCUSSION',
    'SOME_DISCUSSION',
    'DISCUSSED',
    'THOROUGHLY_DISCUSSED',
  ],
})

export const ProtocolAssessmentEnum = enumType({
  name: 'ProtocolAssessmentEnum',
  members: [
    'REFUSED_TO_WORK',
    'NO_EFFORT',
    'WORKED_POORLY',
    'WORKED_WELL',
    'WORKED_VERY_WELL',
  ],
})

export const ActivityTimeEnum = enumType({
  name: 'ActivityTimeEnum',
  members: ['BEFORE', 'DURING', 'AFTER'],
})
