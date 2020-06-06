import { interfaceType, objectType, inputObjectType } from '@nexus/schema'
import { Student, Teacher, Lesson } from '..'

export const Assignment = interfaceType({
  name: 'Assignment',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('hasOwner', { type: Student })
    t.field('hasAssigner', { type: Teacher })
    t.field('score', { type: Score })
    t.string('markingPeriod')
    t.id('associatedLessonId')
    t.date('assignedDate')
    t.boolean('assigned')
    t.date('dueDate')
    t.boolean('late')
    t.boolean('exempt')
    t.field('readings', { type: Readings })
    t.resolveType((assignment) => {
      if (assignment.hasOwnProperty('topic')) {
        return 'Essay'
      }
      if (assignment.hasOwnProperty('testName')) {
        return 'Test'
      }
      return 'Reading_Guide'
    })
  },
})

export const HasOwnerInput = inputObjectType({
  name: 'HasOwnerInput',
  definition(t) {
    t.string('ownerUserName')
  },
})
export const HasAssigner = inputObjectType({
  name: 'HasAssigner',
  definition(t) {
    t.string('assignerUserName')
  },
})

export const Score = objectType({
  name: 'Score',
  definition(t) {
    t.int('earnedPoints')
    t.int('maxPoints')
  },
})
export const Readings = objectType({
  name: 'Readings',
  definition(t) {
    t.string('readingPages')
    t.string('readingSections')
  },
})
