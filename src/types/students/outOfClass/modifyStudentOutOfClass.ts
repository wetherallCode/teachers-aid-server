import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { MarkingPeriodEnum } from '../../general'
import { OutOfClassDestinationEnum } from './studentOutOfClass'

export const ModifyStudentOutOfClassInput = inputObjectType({
  name: 'ModifyStudentOutOfClassInput',
  definition(t) {
    t.id('outOfClassId')
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.string('date')
    t.string('departTime')
    t.string('returnTime')
    t.boolean('hasReturned')
    t.field('outOfClassDestination', { type: OutOfClassDestinationEnum })
  },
})

export const ModifyStudentOutOfClassPayload = objectType({
  name: 'ModifyStudentOutOfClassPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyStudentOutOfClass = queryField('modifyStudentOutOfClass', {
  type: ModifyStudentOutOfClassPayload,
  args: { input: arg({ type: ModifyStudentOutOfClassInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        outOfClassId,
        markingPeriod,
        date,
        departTime,
        returnTime,
        hasReturned,
        outOfClassDestination,
      },
    },
    { studentData }
  ) {
    const outOfClassCheck = await studentData.findOne({
      _id: new ObjectId(outOfClassId!),
    })
    if (outOfClassCheck) {
      const { modifiedCount } = await studentData.updateOne(
        { _id: new ObjectId(outOfClassId!) },
        {
          $set: {
            returnTime,
            markingPeriod,
            date,
            hasReturned,
            departTime,
            outOfClassDestination,
          },
        }
      )
      return { modified: modifiedCount === 1 ? true : false }
    } else throw new Error('OutOfClass Entry does not exist')
  },
})
