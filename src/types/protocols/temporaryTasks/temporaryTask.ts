import { objectType } from '@nexus/schema'
import { Course } from '../../courses'
import { Student } from '../../students'

export const TemporaryTask = objectType({
  name: 'TemporaryTask',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('dateIssued')
    t.boolean('answered')
    t.field('student', { type: Student })
    t.int('taskNumber')
    t.boolean('studentPresent')
  },
})
