import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { ResponsibilityPoints } from '..'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const CreateResponsibilityPointsInput = inputObjectType({
  name: 'CreateResponsibilityPointsInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.id('courseId', { required: true })
  },
})

export const CreateResponsibilityPointsPayload = objectType({
  name: 'CreateResponsibilityPointsPayload',
  definition(t) {
    t.list.field('responsibilityPoints', { type: ResponsibilityPoints })
  },
})

export const CreateResponsibilityPoints = mutationField(
  'createResponsibilityPoints',
  {
    type: CreateResponsibilityPointsPayload,
    args: {
      input: arg({ type: CreateResponsibilityPointsInput, required: true }),
    },
    async resolve(
      _,
      { input: { studentIds, markingPeriod, courseId } },
      { studentData, userData, courseData }
    ) {
      let studentList: NexusGenRootTypes['ResponsibilityPoints'][] = []
      const course = await courseData.findOne({ _id: new ObjectId(courseId) })
      for (const _id of studentIds) {
        const student = await userData.findOne({ _id: new ObjectId(_id) })
        const responsibilityPointsCheck = await studentData.findOne({
          'student._id': new ObjectId(_id),
          responsibilityPoints: { $exists: true },
          markingPeriod: markingPeriod,
          behavior: { $exists: false },
        })
        console.log(responsibilityPointsCheck)
        if (student) {
          if (!responsibilityPointsCheck) {
            const responsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'] =
              {
                markingPeriod,
                responsibilityPoints: 100,
                student,
                inCourse: course,
              }
            const { insertedId } = await studentData.insertOne(
              responsibilityPoints
            )
            responsibilityPoints._id = insertedId
            studentList.push(responsibilityPoints)
          } else
            throw new Error(
              'Student Responsibility Points have already been created for this marking period'
            )
        } else throw new Error('studentId unrecognized')
      }

      return { responsibilityPoints: studentList }
    },
  }
)
