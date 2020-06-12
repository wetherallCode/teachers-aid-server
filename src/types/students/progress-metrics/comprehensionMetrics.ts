import { objectType } from '@nexus/schema'

export const ComprehensionMetrics = objectType({
  name: 'ComprehensionMetrics',
  definition(t) {
    t.typeName
    t.implements('ProgressMetrics')
    t.int('comprehensionLevel')

    // ability to identify opposing factors
    // ability to identify opposing factors goals
    // ability to identify conflict bewteen opposing factors
  },
})
