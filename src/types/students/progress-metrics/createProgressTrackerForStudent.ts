import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes, NexusGenEnums } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateProgressTrackerForStudentInput = inputObjectType({
  name: 'CreateProgressTrackerForStudentInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const CreateProgressTrackerForStudentPayload = objectType({
  name: 'CreateProgressTrackerForStudentPayload',
  definition(t) {
    t.boolean('created')
  },
})

export const CreateProgressTrackerForStudent = mutationField(
  'createProgressTrackerForStudent',
  {
    type: CreateProgressTrackerForStudentPayload,
    args: {
      input: arg({
        type: CreateProgressTrackerForStudentInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId } }, { userData, studentData }) {
      const student: NexusGenRootTypes['Student'] = await userData.findOne({
        _id: new ObjectId(studentId),
      })
      console.log(student)
      const progressTracker: NexusGenRootTypes['ProgressTracker'] = {
        student,
        inCourse: student.inCourses[0],
        writingProgressTracker: {
          levelPoints: 0,
          overallWritingLevel: 'DEVELOPING',
        },
        readingGuideProgressTracker: {
          levelPoints: 0,
          readingGuideLevel: 'BASIC',
        },
      }

      const { insertedId } = await studentData.insertOne(progressTracker)
      progressTracker._id = insertedId

      return { created: progressTracker._id ? true : false }
      // return { created: false }
    },
  }
)
