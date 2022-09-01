import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { MarkingPeriodEnum } from '../../general'

import { LatenessTypeEnum, StudentLateness } from './studentLateness'

export const CreateLatenessInput = inputObjectType({
  name: 'CreateLatenessInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('dayLate', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.field('latenessType', { type: LatenessTypeEnum, required: true })
  },
})

export const CreateLatenessPayload = objectType({
  name: 'CreateLatenessPayload',
  definition(t) {
    t.field('studentLateness', { type: StudentLateness })
  },
})

export const CreateLateness = mutationField('createLateness', {
  type: CreateLatenessPayload,
  args: { input: arg({ type: CreateLatenessInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, dayLate, markingPeriod, latenessType } },
    { userData, studentData }
  ) {
    const student: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: new ObjectId(studentId),
    })

    const studentLatenessCheck: NexusGenRootTypes['StudentLateness'] =
      await studentData.findOne({
        'student._id': new ObjectId(student._id!),
        dayLate,
      })

    if (
      studentLatenessCheck &&
      studentLatenessCheck.latenessType === latenessType
    ) {
      throw new Error(
        student.userName +
          ' already has a ' +
          latenessType.toString().toLowerCase() +
          ' lateness assigned for ' +
          dayLate
      )
    }

    const lateness: NexusGenRootTypes['StudentLateness'] = {
      student,
      dayLate,
      markingPeriod,
      latenessType,
    }
    const { insertedId } = await studentData.insertOne(lateness)
    lateness._id = insertedId
    if (latenessType === 'UNEXCUSED') {
      const { modifiedCount } = studentData.updateOne(
        {
          'student._id': new ObjectId(studentId),
          markingPeriod,
          responsibilityPoints: { $exists: true },
        },
        {
          $inc: {
            responsibilityPoints: -5,
          },
        }
      )
      console.log(modifiedCount)
      const readyForClassCheck = await studentData.findOne({
        'student._id': new ObjectId(studentId),
        date: dayLate,
        'behavior._id': new ObjectId('62a33f0c2c8c161570b3c258'),
      })

      if (readyForClassCheck) {
        await studentData.deleteOne({
          'student._id': new ObjectId(studentId),
          date: dayLate,
          'behavior._id': new ObjectId('62a33f0c2c8c161570b3c258'),
        })
        await studentData.updateOne(
          {
            'student._id': new ObjectId(studentId),
            markingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: {
              responsibilityPoints: -2,
            },
          }
        )
      }
    }
    return { studentLateness: lateness }
  },
})
