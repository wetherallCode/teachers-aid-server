import { objectType } from '@nexus/schema'
import { Teacher, Student } from '..'

export const Course = objectType({
  name: 'Course',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('period')
    t.field('hasTeacher', { type: Teacher })
    t.list.field('hasStudents', { type: Student })
  },
})
