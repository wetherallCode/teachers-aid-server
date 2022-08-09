import { enumType, objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { Student } from '../student'

export const StudentOutOfClass = objectType({
  name: 'StudentOutOfClass',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.string('date')
    t.string('departTime')
    t.string('returnTime')
    t.boolean('hasReturned')
    t.field('outOfClassDestination', { type: OutOfClassDestinationEnum })
  },
})

export const OutOfClassDestinationEnum = enumType({
  name: 'OutOfClassDestinationEnum',
  members: [
    'BATHROOM',
    'NURSE',
    'OTHER_CLASS',
    'OFFICE',
    'GUIDANCE',
    'BAND',
    'CHOIR',
  ],
})
