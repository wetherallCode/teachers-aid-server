import { enumType, objectType } from '@nexus/schema'
import { Student } from '..'

export const StudentBehavior = objectType({
  name: 'StudentBehavior',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.string('date')
    t.field('behavior', { type: BehaviorEnum })
  },
})

export const BehaviorEnum = enumType({
  name: 'BehaviorEnum',
  members: [
    'ANSWERED_QUESTION',
    'DID_NOT_ANSWER_QUESTION',
    'DISRUPTIVE',
    'DISRESPECTFUL',
  ],
})
