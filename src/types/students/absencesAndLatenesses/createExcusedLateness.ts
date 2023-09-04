import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { UnexcusedLateness } from '..'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { ExcusedLateness } from './excusedLateness'

export const CreateExcusedLatenessInput = inputObjectType({
  name: 'CreateExcusedLatenessInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('dayLate', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const CreateExcusedLatenessPayload = objectType({
  name: 'CreateExcusedLatenessPayload',
  definition(t) {
    t.field('excusedLateness', { type: ExcusedLateness })
  },
})

export const CreateExcusedLateness = mutationField('createExcusedLateness', {
  type: CreateExcusedLatenessPayload,
  args: {
    input: arg({ type: CreateExcusedLatenessInput, required: true }),
  },
  async resolve(
    _,
    { input: { studentId, dayLate, markingPeriod } },
    { userData, studentData, protocolData }
  ) {
    const student: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: new ObjectId(studentId),
    })

    const studentLatenessCheck: NexusGenRootTypes['ExcusedLateness'] =
      await studentData.findOne({
        'student._id': new ObjectId(student._id!),
        dayLate,
      })

    // const latenessSearch = studentLatenesses.some(
    //   (lateness) => lateness.dayLateExcused === dayLateExcused
    // )

    if (!studentLatenessCheck) {
      const excusedLateness: NexusGenRootTypes['ExcusedLateness'] = {
        student,
        dayLate,
        markingPeriod,
        latenessType: 'EXCUSED',
      }
      const { insertedId } = await studentData.insertOne(excusedLateness)
      excusedLateness._id = insertedId

      const readyForClassCheck = await studentData.findOne({
        'student._id': new ObjectId(studentId),
        date: dayLate,
        'behavior._id': new ObjectId('62a33f0c2c8c161570b3c258'),
      })
      // if (readyForClassCheck) {
      //   await studentData.deleteOne({
      //     'student._id': new ObjectId(studentId),
      //     date: dayLate,
      //     'behavior._id': new ObjectId('62a33f0c2c8c161570b3c258'),
      //   })

      //   await studentData.updateOne(
      //     {
      //       'student._id': new ObjectId(studentId),
      //       markingPeriod,
      //       responsibilityPoints: { $exists: true },
      //     },
      //     {
      //       $inc: {
      //         responsibilityPoints: -2,
      //       },
      //     }
      //   )
      // }
      protocolData.deleteOne({
        assignedDate: dayLate,
        'student._id': new ObjectId(studentId),
        activityTime: 'BEFORE',
      })

      return { excusedLateness }
    } else
      throw new Error(
        student.userName +
          ' already has an excused lateness assigned for ' +
          dayLate
      )
  },
})
