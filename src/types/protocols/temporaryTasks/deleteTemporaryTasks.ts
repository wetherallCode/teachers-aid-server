import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const DeleteTemporaryTasksInput = inputObjectType({
  name: 'DeleteTemporaryTasksInput',
  definition(t) {
    t.string('dateIssued', { required: true })
    t.int('taskNumber', { required: true })
    t.id('courseId', { required: true })
  },
})

export const DeleteTemporaryTasksPayload = objectType({
  name: 'DeleteTemporaryTasksPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteTemporaryTasks = mutationField('deleteTemporaryTasks', {
  type: DeleteTemporaryTasksPayload,
  args: { input: arg({ type: DeleteTemporaryTasksInput, required: true }) },
  async resolve(
    _,
    { input: { dateIssued, taskNumber, courseId } },
    { temporaryTaskData, studentData, generalData }
  ) {
    const mp = await generalData.findOne({
      currentMarkingPeriod: { $exists: true },
    })
    const taskCheck: NexusGenRootTypes['TemporaryTask'][] =
      await temporaryTaskData
        .find({
          dateIssued,
          'student.inCourses._id': new ObjectId(courseId),
          taskNumber,
        })
        .toArray()

    let removed = false
    if (taskCheck.length > 0) {
      for (const task of taskCheck) {
        if (task.answered) {
          studentData.updateOne(
            {
              'student._id': new ObjectId(task.student._id!),
              markingPeriod: mp.currentMarkingPeriod,
              responsibilityPoints: { $exists: true },
              behavior: { $exists: false },
            },
            {
              $inc: { responsibilityPoints: -2 },
            }
          )
        }
      }
      const { deletedCount } = await temporaryTaskData.deleteMany({
        dateIssued,
        'student.inCourses._id': new ObjectId(courseId),
        taskNumber,
      })
      if (taskCheck.length === deletedCount) {
        removed = true
      }

      return { removed }
      // if (deletedCount === 1) {
      //   return { removed: true }
      // } else throw new Error('Something went wrong')
      //   }
    }
    return { removed }
  },
})
