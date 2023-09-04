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

export const ControlWarmUpInput = inputObjectType({
  name: 'ControlWarmUpInput',
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

export const ControlWarmUpPayload = objectType({
  name: 'ControlWarmUpPayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const ControlWarmUp = mutationField('controlWarmUp', {
  type: ControlWarmUpPayload,
  args: { input: arg({ type: ControlWarmUpInput, required: true }) },
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
    const protocols: NexusGenRootTypes['Protocol'][] = []
    if (lessonCheck) {
      await lessonData.updateOne(
        {
          _id: new ObjectId(lessonId),
        },
        {
          $set: {
            'beforeActivity.isActive': isActive,
            'beforeActivity.completed': !isActive ? true : false,
          },
        }
      )

      if (isActive) {
        //create a warmup protocol
        for (const studentId of studentIds) {
          const student: NexusGenRootTypes['Student'] = await userData.findOne({
            _id: new ObjectId(studentId),
          })

          const protocolCheck: NexusGenRootTypes['Protocol'] =
            await protocolData.findOne({
              'student._id': new ObjectId(studentId),
              task,
              assignedDate: new Date().toLocaleDateString(),
            })

          if (!protocolCheck) {
            const protocol: NexusGenRootTypes['Protocol'] = {
              academicOutcomeType,
              assignedDate: new Date().toLocaleDateString(),
              isActive: true,
              markingPeriod,
              protocolActivityType,
              completed: false,
              startTime: new Date().toLocaleTimeString(),
              student,
              task,
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
          }
        }
        return { protocols }
      } else {
        for (const studentId of studentIds) {
          const protocolCheck: NexusGenRootTypes['Protocol'] =
            await protocolData.findOne({
              'student._id': new ObjectId(studentId),

              activityTime: 'BEFORE',
              assignedDate: new Date().toLocaleDateString(),
            })

          if (protocolCheck) {
            protocolData.updateOne(
              {
                'student._id': new ObjectId(studentId),

                activityTime: 'BEFORE',
                assignedDate: new Date().toLocaleDateString(),
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
