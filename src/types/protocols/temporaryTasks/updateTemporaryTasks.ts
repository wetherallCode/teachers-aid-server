import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const UpdateTemporaryTasksInput = inputObjectType({
  name: 'UpdateTemporaryTasksInput',
  definition(t) {
    t.string('dateIssued', { required: true })
    t.int('taskNumber', { required: true })
    t.id('courseId', { required: true })
    t.string('newDateIssued')
    t.int('newTaskNumber')
  },
})

export const UpdateTemporaryTasksPayload = objectType({
  name: 'UpdateTemporaryTasksPayload',
  definition(t) {
    t.list.field('temporaryTasks', { type: TemporaryTask })
  },
})

export const UpdateTemporaryTasks = mutationField('updateTemporaryTasks', {
  type: UpdateTemporaryTasksPayload,
  args: { input: arg({ type: UpdateTemporaryTasksInput, required: true }) },
  async resolve(
    _,
    {
      input: { dateIssued, taskNumber, courseId, newDateIssued, newTaskNumber },
    },
    { temporaryTaskData }
  ) {
    const taskCheck: NexusGenRootTypes['TemporaryTask'][] = await temporaryTaskData
      .find({
        dateIssued,
        'student.inCourses._id': new ObjectId(courseId),
        taskNumber,
      })
      .toArray()
    if (taskCheck) {
      if (newDateIssued) {
        temporaryTaskData.updateMany(
          {
            dateIssued,
            'student.inCourses._id': new ObjectId(courseId),
            taskNumber,
          },
          {
            $set: {
              dateIssued: newDateIssued,
            },
          }
        )
        const temporaryTasks = await temporaryTaskData
          .find({
            dateIssued: newDateIssued,
            'student.inCourses._id': new ObjectId(courseId),
            taskNumber,
          })
          .toArray()
        return { temporaryTasks: temporaryTasks }
      }
      if (newTaskNumber) {
        temporaryTaskData.updateMany(
          {
            dateIssued,
            'student.inCourses._id': new ObjectId(courseId),
            taskNumber,
          },
          {
            $set: {
              taskNumber: newTaskNumber,
            },
          }
        )
        const temporaryTasks = await temporaryTaskData
          .find({
            dateIssued,
            'student.inCourses._id': new ObjectId(courseId),
            taskNumber: newTaskNumber,
          })
          .toArray()
        return { temporaryTasks: temporaryTasks }
      }
      return { temporaryTasks: taskCheck }
    } else throw new Error('Tasks have not been created')
  },
})
