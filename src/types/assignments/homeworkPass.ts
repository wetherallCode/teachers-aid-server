import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import e = require('cors')
import { ObjectId } from 'mongodb'
import { NetworkInterfaceBase } from 'os'
import { MarkingPeriodEnum } from '../general'

export const HomeworkPassInput = inputObjectType({
  name: 'HomeworkPassInput',
  definition(t) {
    t.id('assignmentId', { required: true })
    t.id('ownerId', { required: true })
    t.string('assignmentType', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const HomeworkPassPayload = objectType({
  name: 'HomeworkPassPayload',
  definition(t) {
    t.boolean('success')
  },
})

export const HomeworkPass = mutationField('homeworkPass', {
  type: HomeworkPassPayload,
  args: { input: arg({ type: HomeworkPassInput, required: true }) },
  async resolve(
    _,
    { input: { ownerId, assignmentId, assignmentType, markingPeriod } },
    { studentData, assignmentData },
  ) {
    // const assignment = await assignmentData.findOne({
    //   _id: new ObjectId(assignmentId),
    // })

    const { modifiedCount } = await assignmentData.updateMany(
      {
        _id: new ObjectId(assignmentId),
      },
      { $set: { assigned: false, exempt: true } },
    )
    await studentData.updateOne(
      {
        'student._id': new ObjectId(ownerId),
        markingPeriod: markingPeriod,
        responsibilityPoints: { $exists: true },
        behavior: { $exists: false },
      },
      {
        $inc: {
          responsibilityPoints:
            assignmentType === 'ESSAY' || assignmentType === 'READING_GUIDE'
              ? 2
              : 0,
        },
      },
    )
    return { success: modifiedCount === 1 }
  },
})
