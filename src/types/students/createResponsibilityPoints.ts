import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'
import { ResponsibilityPoints } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const CreateResponsibilityPointsInput = inputObjectType({
  name: 'CreateResponsibilityPointsInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
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
      { input: { studentIds, markingPeriod } },
      { studentData, userData }
    ) {
      let studentList: NexusGenRootTypes['ResponsibilityPoints'][] = []

      for (const _id of studentIds) {
        const student = await userData.findOne({ _id: new ObjectId(_id) })
        const responsibilityPointsCheck = await studentData.findOne({
          'student._id': new ObjectId(_id),
          responsibilityPoints: { $exists: true },
          markingPeriod: markingPeriod,
        })

        if (student) {
          if (!responsibilityPointsCheck) {
            const responsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'] = {
              markingPeriod,
              responsibilityPoints: 100,
              student,
            }
            const insertedId = await studentData.insertOne(responsibilityPoints)
            responsibilityPoints._id = insertedId
            studentList.push(responsibilityPoints)
          } else
            throw new Error(
              'Student Responsibility Points have already been created for this marking period'
            )
        } else throw new Error('studentId unreckognized')
      }

      return { responsibilityPoints: studentList }
    },
  }
)