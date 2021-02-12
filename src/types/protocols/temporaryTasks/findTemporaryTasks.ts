import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindTemporaryTasksInput = inputObjectType({
  name: 'FindTemporaryTasksInput',
  definition(t) {
    t.string('dateIssued', { required: true })
    t.int('taskNumber', { required: true })
    t.id('courseId', { required: true })
  },
})

export const FindTemporaryTasksPayload = objectType({
  name: 'FindTemporaryTasksPayload',
  definition(t) {
    t.list.field('temporaryTasks', { type: TemporaryTask })
  },
})

export const FindTemporaryTasks = queryField('findTemporaryTasks', {
  type: FindTemporaryTasksPayload,
  args: { input: arg({ type: FindTemporaryTasksInput, required: true }) },
  async resolve(
    _,
    { input: { dateIssued, taskNumber, courseId } },
    { temporaryTaskData }
  ) {
    const temporaryTaskCheck: NexusGenRootTypes['TemporaryTask'][] = await temporaryTaskData
      .find({
        dateIssued,
        'student.inCourses._id': new ObjectId(courseId),
        taskNumber,
      })
      .toArray()
    if (temporaryTaskCheck.length > 0) {
      return { temporaryTasks: temporaryTaskCheck }
    } else throw new Error('Tasks have not been created')
  },
})
