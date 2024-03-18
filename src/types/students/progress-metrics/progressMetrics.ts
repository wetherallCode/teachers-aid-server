import { interfaceType } from '@nexus/schema'
import { OverallWritingMetric, Student } from '..'

export const ProgressMetrics = interfaceType({
  name: 'ProgressMetrics',
  definition(t) {
    // @ts-ignore
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
