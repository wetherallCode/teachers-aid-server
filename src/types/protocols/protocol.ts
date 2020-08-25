import { enumType, objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'
import { AcademicOutcomeTypes, ProtocolActivityTypes } from '../textSections'
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
  },
})

export const DiscussionTypesEnum = enumType({
  name: 'DiscussionTypesEnum',
  members: [
    'NOT_REQUIRED',
    'SOME_DISCUSSION',
    'DISCUSSED',
    'THOROUGHLY_DISCUSSED',
  ],
})

export const ProtocolAssessmentEnum = enumType({
  name: 'ProtocolAssessmentEnum',
  members: [
    'REFUSED_TO_WORK',
    'SLOW_TO_GET_STARTED',
    'WORKED_POORLY',
    'WORKED_WELL',
  ],
})
