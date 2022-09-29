import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId, ObjectID } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ProgressMetrics } from './progressMetrics'
import { WritingMetrics } from './writingMetrics'

export const CreateProgressMetricsInput = inputObjectType({
  name: 'CreateProgressMetricsInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const CreateProgressMetricsPayload = objectType({
  name: 'CreateProgressMetricsPayload',
  definition(t) {
    t.field('writingMetric', { type: WritingMetrics })
  },
})

export const CreateProgressMetrics = mutationField('createProgressMetrics', {
  type: CreateProgressMetricsPayload,
  args: { input: arg({ type: CreateProgressMetricsInput, required: true }) },
  async resolve(_, { input: { studentId } }, { studentData, userData }) {
    const student: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: new ObjectId(studentId),
    })

    const progressMetric: NexusGenRootTypes['ProgressMetrics'] = {
      overallWritingMetric: {
        levelPoints: 0,
        overallWritingLevel: 'DEVELOPING',
      },
      howProblemSolutionMetrics: {
        howProblemSolutionLevel: 'DEVELOPING',
        levelPoints: 0,
      },
      howCauseEffectMetrics: {
        howCauseEffectLevel: 'DEVELOPING',
        levelPoints: 0,
      },
      whyCauseEffectMetrics: {
        levelPoints: 0,
        whyCauseEffectLevel: 'DEVELOPING',
      },
      inCourse: student.inCourses[0],
      student,
    }
    const { insertedId } = await studentData.insertOne(progressMetric)

    progressMetric._id = insertedId

    return { writingMetric: progressMetric }
  },
})
