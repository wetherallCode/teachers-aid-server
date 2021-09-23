import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'
import { UnexcusedLateness } from '.'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateUnexcusedLatenessInput = inputObjectType({
  name: 'CreateUnexcusedLatenessInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.date('dayLate', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const CreateUnexcusedLatenessPayload = objectType({
  name: 'CreateUnexcusedLatenessPayload',
  definition(t) {
    t.field('unexcusedLateness', { type: UnexcusedLateness })
  },
})

export const CreateUnexcusedLateness = mutationField(
  'createUnexcusedLateness',
  {
    type: CreateUnexcusedLatenessPayload,
    args: {
      input: arg({ type: CreateUnexcusedLatenessInput, required: true }),
    },
    async resolve(
      _,
      { input: { studentId, dayLate, markingPeriod } },
      { userData, studentData }
    ) {
      const student: NexusGenRootTypes['Student'] = await userData.findOne({
        _id: new ObjectId(studentId),
      })

      const studentLatenesses: NexusGenRootTypes['UnexcusedLateness'][] =
        await studentData
          .find({
            'student._id': new ObjectId(student._id!),
            dayLate: { $exists: true },
          })
          .toArray()

      const latenessSearch = studentLatenesses.some(
        (lateness) => lateness.dayLate === dayLate
      )
      if (!latenessSearch) {
        const unexcusedLateness: NexusGenRootTypes['UnexcusedLateness'] = {
          student,
          dayLate,
          markingPeriod,
        }
        const { insertedId } = await studentData.insertOne(unexcusedLateness)
        unexcusedLateness._id = insertedId
        studentData.updateOne(
          {
            'student._id': studentId,
            markingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: {
              responsibilityPoints: -5,
            },
          }
        )
        return { unexcusedLateness }
      } else
        throw new Error(
          student.userName + ' already has absence assigned for ' + dayLate
        )
    },
  }
)
