import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { TemporaryTask } from '.'
import { MarkingPeriodEnum } from '../../general'

export const CreateTemporaryTasksInput = inputObjectType({
  name: 'CreateTemporaryTasksInput',
  definition(t) {
    t.string('dateIssued', { required: true })
    t.int('taskNumber', { required: true })
    t.id('courseId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const CreateTemporaryTasksPayload = objectType({
  name: 'CreateTemporaryTasksPayload',
  definition(t) {
    t.list.field('temporaryTasks', { type: TemporaryTask })
  },
})

export const CreateTemporaryTasks = mutationField('createTemporaryTasks', {
  type: CreateTemporaryTasksPayload,
  args: { input: arg({ type: CreateTemporaryTasksInput, required: true }) },
  async resolve(
    _,
    { input: { dateIssued, taskNumber, courseId, markingPeriod } },
    { temporaryTaskData, userData }
  ) {
    const taskCheck: NexusGenRootTypes['TemporaryTask'][] = await temporaryTaskData
      .find({
        dateIssued,
        'student.inCourses._id': new ObjectId(courseId),
        taskNumber,
      })
      .toArray()

    const duplicateTasks = taskCheck.length > 0

    if (!duplicateTasks) {
      const temporaryTasks: NexusGenRootTypes['TemporaryTask'][] = []

      const students: NexusGenRootTypes['Student'][] = await userData
        .find({ 'inCourses._id': new ObjectId(courseId) })
        .toArray()

      for (const student of students) {
        const newtemporaryTask: NexusGenRootTypes['TemporaryTask'] = {
          dateIssued,
          answered: false,
          studentPresent: true,
          taskNumber,
          student: student,
          markingPeriod: markingPeriod,
        }

        const { insertedId } = await temporaryTaskData.insertOne(
          newtemporaryTask
        )
        newtemporaryTask._id = insertedId

        temporaryTasks.push(newtemporaryTask)
      }

      return { temporaryTasks }
    } else throw new Error('Tasks already created')
  },
})
