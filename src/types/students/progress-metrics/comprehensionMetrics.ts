import { enumType, objectType } from '@nexus/schema'
import { Course } from '../../courses'

export const ComprehensionMetrics = objectType({
  name: 'ComprehensionMetrics',
  definition(t) {
    t.typeName
    t.implements('ProgressMetrics')
    t.field('comprehensionLevel', { type: ComprehensionLevelEnum })
    t.float('levelPoints')
    t.field('inCourse', { type: Course })
    // ability to identify opposing factors
    // ability to identify opposing factors goals
    // ability to identify conflict bewteen opposing factors
  },
})

export const ComprehensionLevelEnum = enumType({
  name: 'ComprehensionLevelEnum',
  members: ['Basic', 'Developing', 'Academic', 'Advanced', 'Master'],
})
