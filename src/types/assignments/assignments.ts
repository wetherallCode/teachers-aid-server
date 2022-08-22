import {
  interfaceType,
  objectType,
  inputObjectType,
  enumType,
} from '@nexus/schema'
import { Student, Teacher, Lesson } from '..'
import { MarkingPeriodEnum } from '../general'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const Assignment = interfaceType({
  name: 'Assignment',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('hasOwner', { type: Student })
    t.field('hasAssigner', { type: Teacher })
    t.field('score', { type: Score })
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.id('associatedLessonId', { nullable: true })
    t.field('lessonInfo', {
      nullable: true,
      type: Lesson,
      async resolve(parent, __, { lessonData }) {
        const lessonInfo: NexusGenRootTypes['Lesson'] = lessonData.findOne({
          _id: new ObjectId(parent.associatedLessonId!),
        })
        return lessonInfo
      },
    })
    t.string('dueTime')
    t.string('assignedDate')
    t.boolean('paperBased')
    t.boolean('assigned')
    t.string('dueDate')
    t.boolean('late')
    t.boolean('exempt')
    t.boolean('missing')
    t.field('gradeType', { type: GradeTypeEnum })
    t.field('readings', { type: Readings })
    t.resolveType((assignment) => {
      if (assignment.hasOwnProperty('topic')) {
        return 'Essay'
      }
      if (assignment.hasOwnProperty('graded')) {
        return 'ReadingGuide'
      }
      if (assignment.hasOwnProperty('specialAssignmentGraded')) {
        return 'SpecialAssignment'
      }
      return 'Quiz'
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
    t.float('earnedPoints')
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

export const TimeOfDayEnum = enumType({
  name: 'TimeOfDay',
  members: ['BEFORE_SCHOOL', 'BEFORE_CLASS', 'AFTER_CLASS', 'AFTER_SCHOOL'],
})

export const GradeTypeEnum = enumType({
  name: 'GradeTypeEnum',
  members: ['PRIMARY', 'SECONDARY', 'SUPPORTIVE'],
})
