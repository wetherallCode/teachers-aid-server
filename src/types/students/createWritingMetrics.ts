import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const CreateWritingMetricsPayload = objectType({
  name: 'CreateWritingMetricsPayload',
  definition(t) {
    t.boolean('created')
  },
})

export const CreateWritingMetrics = mutationField('createWritingMetrics', {
  type: CreateWritingMetricsPayload,
  // args: { input: arg({ type: CreateWritingMetricsInput, required: true }) },
  async resolve(_, __, { studentData, userData }) {
    // const studentWritingMetric = await studentData.findMany({
    //   'student._id': new ObjectId(_id),
    //   howCauseEffectMetrics: { $exists: true },
    // })
    // if (!studentWritingMetric) {
    const students: NexusGenRootTypes['Student'][] = await userData
      .find({ inCourses: { $exists: true } })
      .toArray()
    let count = 0
    for (const student of students) {
      const writingMetric: NexusGenRootTypes['WritingMetrics'] = {
        student,
        inCourse: student.inCourses[0],
        overallWritingMetric: {
          overallWritingLevel: 'DEVELOPING',
          levelPoints: 0,
        },
        howCauseEffectMetrics: {
          howCauseEffectLevel: 'DEVELOPING',
          levelPoints: 0,
        },
        howProblemSolutionMetrics: {
          howProblemSolutionLevel: 'DEVELOPING',
          levelPoints: 0,
        },
        whyCauseEffectMetrics: {
          whyCauseEffectLevel: 'DEVELOPING',
          levelPoints: 0,
        },
      }
      const { insertedId } = await studentData.insertOne(writingMetric)
      if (insertedId) count++
      writingMetric._id = insertedId
    }

    if (students.length === count) {
      return { created: true }
    } else return { created: false }
  },
})
