import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { MarkingPeriodEnum } from '../../general'
import {
  OutOfClassDestinationEnum,
  StudentOutOfClass,
} from './studentOutOfClass'

export const CreateStudentOutOfClassInput = inputObjectType({
  name: 'CreateStudentOutOfClassInput',
  definition(t) {
    t.string('studentId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.string('date', { required: true })

    t.field('outOfClassDestination', {
      type: OutOfClassDestinationEnum,
      required: true,
    })
  },
})

export const CreateStudentOutOfClassPayload = objectType({
  name: 'CreateStudentOutOfClassPayload',
  definition(t) {
    t.field('studentOutOfClass', { type: StudentOutOfClass })
  },
})

export const CreateStudentOutOfClass = mutationField(
  'createStudentOutOfClass',
  {
    type: CreateStudentOutOfClassPayload,
    args: {
      input: arg({ type: CreateStudentOutOfClassInput, required: true }),
    },
    async resolve(
      _,
      { input: { studentId, markingPeriod, date, outOfClassDestination } },
      { userData, studentData }
    ) {
      const studentCheck = await userData.findOne({
        _id: new ObjectId(studentId),
      })

      if (studentCheck) {
        const studentOutOfClass: NexusGenRootTypes['StudentOutOfClass'] = {
          student: studentCheck,
          date,
          departTime: new Date().toLocaleTimeString(),
          hasReturned: false,
          returnTime: '',
          markingPeriod,

          outOfClassDestination,
        }

        const { insertedId } = await studentData.insertOne(studentOutOfClass)
        studentOutOfClass._id = insertedId
        return { studentOutOfClass }
      } else throw new Error('Cannot find student')
    },
  }
)
