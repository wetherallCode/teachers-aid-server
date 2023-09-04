import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import {
  AcademicOutcomeTypes,
  ActivityTimeEnum,
  Lesson,
  MarkingPeriodEnum,
  Protocol,
  ProtocolActivityTypes,
} from '..'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { getRandomInt } from '../../utilities'

export const ControlCoolDownInput = inputObjectType({
  name: 'ControlCoolDownInput',
  definition(t) {
    t.id('lessonId', { required: true })
    t.boolean('isActive', { required: true })
    t.list.id('studentIds', { required: true })
    t.field('academicOutcomeType', {
      type: AcademicOutcomeTypes,
      required: true,
    })
    t.field('protocolActivityType', {
      type: ProtocolActivityTypes,
      required: true,
    })
    t.field('academicOutcomeType', {
      type: AcademicOutcomeTypes,
      required: true,
    })
    t.string('task', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.field('activityTime', { type: ActivityTimeEnum, required: true })
  },
})

export const ControlCoolDownPayload = objectType({
  name: 'ControlCoolDownPayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const ControlCoolDown = mutationField('controlCoolDown', {
  type: ControlCoolDownPayload,
  args: { input: arg({ type: ControlCoolDownInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        lessonId,
        isActive,
        studentIds,
        task,
        academicOutcomeType,
        protocolActivityType,
        markingPeriod,
        activityTime,
      },
    },
    { lessonData, userData, protocolData }
  ) {
    const lessonCheck: NexusGenRootTypes['Lesson'] = await lessonData.findOne({
      _id: new ObjectId(lessonId),
    })
    console.log(task)
    const protocols: NexusGenRootTypes['Protocol'][] = []
    if (lessonCheck) {
      await lessonData.updateOne(
        {
          _id: new ObjectId(lessonId),
        },
        {
          $set: {
            'afterActivity.isActive': isActive,
            'afterActivity.completed': !isActive ? true : false,
          },
        }
      )
      const taskList = [
        'List two things you learned in the lesson.',
        'List two questions you have about the lesson.',
        'What was most confusing about the lesson?',
        'How was the information in this lesson similar or connected to another lesson we have had?',
        'Make one prediction about what will happen in history because of what we learned in this lesson.',
      ]
      if (isActive) {
        //create a warmup protocol
        for (const studentId of studentIds) {
          const student: NexusGenRootTypes['Student'] = await userData.findOne({
            _id: new ObjectId(studentId),
          })

          // const protocolCheck: NexusGenRootTypes['Protocol'] =
          //   await protocolData.findOne({
          //     'student._id': new ObjectId(studentId),
          //     task,
          //     assignedDate: new Date().toLocaleDateString(),
          //   })

          // if (!protocolCheck) {
          const protocol: NexusGenRootTypes['Protocol'] = {
            academicOutcomeType,
            assignedDate: new Date().toLocaleDateString(),
            isActive: true,
            markingPeriod,
            protocolActivityType,
            completed: false,
            startTime: new Date().toLocaleTimeString(),
            student,
            task: taskList[getRandomInt(taskList.length)],
            activityTime,
            lastScore: 0,
            lessonId,
            assessment: 'REFUSED_TO_WORK',
            discussionLevel:
              protocolActivityType === 'SMALL_GROUP' ? 'DISCUSSED' : null,
          }
          const { insertedId } = await protocolData.insertOne(protocol)
          protocol._id = insertedId
          protocols.push(protocol)
          // }
        }

        return { protocols }
      } else {
        for (const studentId of studentIds) {
          const protocolCheck: NexusGenRootTypes['Protocol'] =
            await protocolData.findOne({
              'student._id': new ObjectId(studentId),
              assignedDate: new Date().toLocaleDateString(),
              activityTime: 'AFTER',
            })

          if (protocolCheck) {
            protocolData.updateOne(
              {
                'student._id': new ObjectId(studentId),
                assignedDate: new Date().toLocaleDateString(),
                activityTime: 'AFTER',
              },
              { $set: { isActive: false, completed: true } }
            )
          }
        }
        return { protocols }
      }
    } else throw new Error('Lesson does not exist.')
  },
})
