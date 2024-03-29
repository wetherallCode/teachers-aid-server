import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { StudentAbsence } from './studentAbsence'
import { MarkingPeriodEnum } from '../../general'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { preparedAndReadyInformation } from '../../../utilities'
import { ActivityTimeEnum } from '../../protocols'

export const CreateAbsenceInput = inputObjectType({
  name: 'CreateAbsenceInput',
  definition(t) {
    t.string('studentId', { required: true })
    t.date('dayAbsent', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const CreateAbsencePayload = objectType({
  name: 'CreateAbsencePayload',
  definition(t) {
    t.field('studentAbsence', { type: StudentAbsence })
  },
})

export const CreateAbsence = mutationField('createAbsence', {
  type: CreateAbsencePayload,
  args: { input: arg({ type: CreateAbsenceInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, dayAbsent, markingPeriod } },
    { studentData, userData, protocolData }
  ) {
    const student: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: new ObjectId(studentId),
    })

    const absenceCheck = await studentData.findOne({
      'student._id': new ObjectId(student._id!),
      dayAbsent,
    })

    if (!absenceCheck) {
      const studentAbsence: NexusGenRootTypes['StudentAbsence'] = {
        student,
        dayAbsent,
        markingPeriod,
      }

      const { insertedId } = await studentData.insertOne(studentAbsence)
      studentAbsence._id = insertedId

      const readyForClassCheck = await studentData.findOne({
        'student._id': new ObjectId(studentId),
        date: dayAbsent,
        'behavior._id': new ObjectId(preparedAndReadyInformation.id),
      })

      if (readyForClassCheck) {
        await studentData.deleteOne({
          'student._id': new ObjectId(studentId),
          date: dayAbsent,
          'behavior._id': new ObjectId(preparedAndReadyInformation.id),
        })
        await studentData.updateOne(
          {
            'student._id': new ObjectId(student._id!),
            markingPeriod: markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          {
            $inc: {
              responsibilityPoints:
                -preparedAndReadyInformation.responsiblityPoints,
            },
          }
        )
        //if warmup protocol exists delete it
        protocolData.deleteOne({
          assignedDate: dayAbsent,
          'student._id': new ObjectId(studentId),
          activityTime: 'BEFORE',
        })
      }

      return { studentAbsence }
    } else
      throw new Error(
        student.userName + ' already has absence assigned for ' + dayAbsent
      )
  },
})
