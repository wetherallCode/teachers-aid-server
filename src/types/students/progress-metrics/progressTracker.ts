import { enumType, objectType } from '@nexus/schema'
import { Student } from '../student'
import { Course } from '../../courses'

export const ProgressTracker = objectType({
  name: 'ProgressTracker',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.field('writingProgressTracker', { type: WritingMetric })
    t.field('readingGuideProgressTracker', { type: ReadingGuideMetric })
    t.field('inCourse', { type: Course })
  },
})

export const WritingLevelEnum = enumType({
  name: 'WritingLevelEnum',
  members: ['DEVELOPING', 'ACADEMIC', 'ADVANCED'],
})

export const WritingMetric = objectType({
  name: 'WritingMetric',
  definition(t) {
    t.float('levelPoints')
    t.field('overallWritingLevel', { type: WritingLevelEnum })
  },
})

export const ReadingGuideMetricEnum = enumType({
  name: 'ReadingGuideMetricEnum',
  members: ['BASIC', 'DEVELOPING', 'ACADEMIC', 'ADVANCED', 'MASTER'],
})

export const ReadingGuideMetric = objectType({
  name: 'ReadingGuideMetric',
  definition(t) {
    t.field('readingGuideLevel', { type: ReadingGuideMetricEnum })
    t.float('levelPoints')
  },
})
// {"hasOwner.firstName":"Fake", readingGuideFinal: {$exists: true}, markingPeriod:"FOURTH"}

// {"student.firstName":"Fake"}
