import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import e = require('express')
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { WritingMetrics } from '.'

export const FindWritingMetricsInput = inputObjectType({
  name: 'FindWritingMetricsInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindWritingMetricsPayload = objectType({
  name: 'FindWritingMetricsPayload',
  definition(t) {
    t.field('writingMetrics', { type: WritingMetrics })
  },
})

export const FindWritingMetrics = queryField('findWritingMetrics', {
  type: FindWritingMetricsPayload,
  args: { input: arg({ type: FindWritingMetricsInput, required: true }) },
  async resolve(_, { input: { studentId } }, { studentData }) {
    const writingMetrics: NexusGenRootTypes['WritingMetrics'] = await studentData.findOne(
      {
        'student._id': new ObjectId(studentId),
        overallWritingMetric: { $exists: true },
      }
    )

    if (writingMetrics) {
      return { writingMetrics }
    } else throw new Error('Student Writing Metrics do not exist!')
  },
})
