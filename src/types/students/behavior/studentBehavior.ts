import { enumType, objectType } from '@nexus/schema'
import { Student } from '..'
import { MarkingPeriodEnum } from '../../general'
import { BehaviorType } from './behavior-types'

export const StudentBehavior = objectType({
  name: 'StudentBehavior',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.string('date')
    t.field('behavior', { type: BehaviorType })
    t.float('responsibilityPoints')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
  },
})

export const BehaviorEnum = enumType({
  name: 'BehaviorEnum',
  members: [
    'ANSWERED_QUESTION',
    'DID_NOT_ANSWER_QUESTION',
    'ON_TASK',
    'OFF_TASK',
    'COMPLETED_ASSIGNMENT',
    'REFUSED_TO_WORK',
    'UNPREPARED',
    'EXCESSIVE_TALKING',
    'DISRUPTIVE',
    'DISRESPECTFUL',
    'INNAPROPRIATE_LANGUAGE',
  ],
})
