import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { MarkingPeriodEnum } from '../general'
import { ObjectId } from 'mongodb'

export const UndoHomeworkPassInput = inputObjectType({
  name: 'UndoHomeworkPassInput',
  definition(t) {
    t.id('assignmentId', { required: true })
    t.id('ownerId', { required: true })
    t.string('assignmentType', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const UndoHomeworkPassPayload = objectType({
  name: 'UndoHomeworkPassPayload',
  definition(t) {
    t.boolean('success')
  },
})

export const UndoHomeworkPass = mutationField('undoHomeworkPass', {
  type: UndoHomeworkPassPayload,
  args: { input: arg({ type: UndoHomeworkPassInput, required: true }) },
  async resolve(
    _,
    { input: { assignmentId, ownerId, assignmentType, markingPeriod } },
    { assignmentData, studentData },
  ) {
    const { modifiedCount: assignmentModifiedCount } =
      await assignmentData.updateMany(
        {
          _id: new ObjectId(assignmentId),
        },
        { $set: { assigned: true, exempt: false } },
      )
    const { modifiedCount: studentModifiedCount } = await studentData.updateOne(
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
              ? -2
              : 0,
        },
      },
    )

    return {
      success: assignmentModifiedCount === 1 && studentModifiedCount === 1,
    }
  },
})
