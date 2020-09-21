import { objectType } from '@nexus/schema'
import { Student } from '../..'

export const StudentQuestions = objectType({
  name: 'StudentQuestions',
  definition(t) {
    t.id('_id', { nullable: true })
    t.id('course')
    t.id('associatedSchoolDayId')
    t.string('date')
    t.list.field('questions', { type: StudentQuestion })
  },
})

export const StudentQuestion = objectType({
  name: 'StudentQuestion',
  definition(t) {
    t.field('student', { type: Student })
    t.string('timeAsked')
    t.string('question')
  },
})
