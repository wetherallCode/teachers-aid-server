import { objectType, interfaceType } from '@nexus/schema'
import { OverallWritingMetric, Student } from '..'

export const ProgressMetrics = interfaceType({
  name: 'ProgressMetrics',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.resolveType(() => {
      if (OverallWritingMetric) {
        return 'WritingMetrics'
      }
      return 'ComprehensionMetrics'
    })
  },
})
