import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Student } from '.'
import {
  NexusGenRootTypes,
  NexusGenEnums,
} from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const InitializeStudentsInput = inputObjectType({
  name: 'InitializeStudentsInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.id('courseId', { required: true })
  },
})

export const InitializeStudentsPayload = objectType({
  name: 'InitializeStudentsPayload',
  definition(t) {
    t.list.field('students', { type: Student })
  },
})

export const InitializeStudents = mutationField('initializeStudents', {
  type: InitializeStudentsPayload,
  args: { input: arg({ type: InitializeStudentsInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, courseId } },
    { userData, studentData, courseData }
  ) {
    const course = await courseData.findOne({ _id: new ObjectId(courseId) })
    const markingPeriodList: NexusGenEnums['MarkingPeriodEnum'][] = [
      'FIRST',
      'SECOND',
      'THIRD',
      'FOURTH',
    ]
    let responsibilityPointsList: NexusGenRootTypes['ResponsibilityPoints'][] = []

    for (const _id of studentIds) {
      const student = await userData.findOne({ _id: new ObjectId(_id) })

      // creates 4 marking periods of responsibility point documents
      for (const mp of markingPeriodList) {
        const responsibilityPointsCheck = await studentData.findOne({
          'student._id': new ObjectId(_id),
          responsibilityPoints: { $exists: true },
          markingPeriod: mp,
          inCourse: course,
        })

        if (!responsibilityPointsCheck) {
          const responsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'] = {
            markingPeriod: mp,
            responsibilityPoints: 100,
            student,
            inCourse: course,
          }
          const { insertedId } = await studentData.insertOne(
            responsibilityPoints
          )
          responsibilityPoints._id = insertedId
          responsibilityPointsList.push(responsibilityPoints)
        }
      }
      // creates contactInfo for each student
      const contactInfoCheck = await studentData.findOne({
        'student._id': new ObjectId(_id),
        contactInfo: { $exists: true },
      })
      if (!contactInfoCheck) {
        const studentInformation: NexusGenRootTypes['StudentInformation'] = {
          student,
          contactInfo: [
            {
              guardianFirstName: '',
              guardianLastName: '',
              guardianPhone: '',
              guardianEmail: '',
            },
          ],
        }
        const { insertedId } = await studentData.insertOne(studentInformation)
        studentInformation._id = insertedId
      }
      // creates WritingMetrics for each student
      const studentWritingMetric = await studentData.findOne({
        'student._id': new ObjectId(_id),
        howCauseEffectMetrics: { $exists: true },
      })
      if (!studentWritingMetric) {
        const writingMetric: NexusGenRootTypes['WritingMetrics'] = {
          student,
          inCourse: course,
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
        writingMetric._id = insertedId
      }
    }
    const students: NexusGenRootTypes['Student'][] = []
    for (const _id of studentIds) {
      const student = await userData.findOne({ _id: new ObjectId(_id) })
      students.push(student)
    }
    return { students }
  },
})
