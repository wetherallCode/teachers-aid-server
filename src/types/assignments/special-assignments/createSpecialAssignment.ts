import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import {
  QuestionAndAnswerListInput,
  SpecialAssignment,
  TimeOfDayEnum,
} from '..'
import { MarkingPeriodEnum } from '../../general'

export const CreateSpecialAssignmentInput = inputObjectType({
  name: 'CreateSpecialAssignmentInput',
  definition(t) {
    t.list.id('assignedCourseIds', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('readings', { type: 'ReadingsInput', required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.string('dueDate', { required: true })
    t.field('dueTime', { type: TimeOfDayEnum, required: true })
    t.string('assignedDate', { required: true })
    t.field('questionAndAnswerList', {
      required: true,
      type: QuestionAndAnswerListInput,
    })
  },
})

export const CreateSpecialAssignmentPayload = objectType({
  name: 'CreateSpecialAssignmentPayload',
  definition(t) {
    t.list.field('specialAssignments', { type: SpecialAssignment })
  },
})

export const CreateSpecialAssignment = mutationField(
  'createSpecialAssignment',
  {
    type: CreateSpecialAssignmentPayload,
    args: {
      input: arg({ type: CreateSpecialAssignmentInput, required: true }),
    },
    async resolve(
      _,
      {
        input: {
          assignedCourseIds,
          hasAssignerId,
          maxPoints,
          readings,
          markingPeriod,
          dueDate,

          assignedDate,
        },
      },
      { assignmentData, userData, courseData }
    ) {
      assignmentData

      const assigner: NexusGenRootTypes['Teacher'] = await userData.findOne({
        _id: new ObjectId(hasAssignerId),
      })
      const studentList: NexusGenRootTypes['Student'][] = []
      const newSpecialAssignments: NexusGenRootTypes['SpecialAssignment'][] = []

      for (const _id of assignedCourseIds) {
        const students: NexusGenRootTypes['Student'][] = await userData
          .find({
            'inCourses._id': new ObjectId(_id),
          })
          .toArray()

        students.forEach((student: NexusGenRootTypes['Student']) => {
          studentList.push(student)
        })
      }
      for (const student of studentList) {
        const assignedCourseInfo: NexusGenRootTypes['CourseInfo'] =
          await courseData.findOne({ 'course._id': student.inCourses[0]._id! })

        function assignedDueTime(time: string) {
          if (time === 'BEFORE_SCHOOL') {
            return '8:00:00 AM'
          }
          if (time === 'BEFORE_CLASS') {
            return assignedCourseInfo.startsAt
          }
          if (time === 'AFTER_CLASS') {
            return assignedCourseInfo.endsAt
          }
          if (time === 'AFTER_SCHOOL') {
            return '2:15:00 PM'
          }
          return '8:00:00 AM'
        }
        const newSpecialAssignment: NexusGenRootTypes['SpecialAssignment'] = {
          assigned: false,
          assignedDate,
          completed: false,
          specialAssignmentGraded: false,
          reviewed: false,
          dueDate,
          dueTime: '',
          effort: 'GOOD_EFFORT',
          exempt: false,
          gradeType: 'SECONDARY',
          hasAssigner: assigner,
          hasOwner: student,
          late: true,
          markingPeriod,
          missing: true,
          paperBased: false,
          questionAndAnswerList: [],
          readings,
          score: { earnedPoints: 0, maxPoints },
        }
        const { insertedId } = await assignmentData.insertOne(
          newSpecialAssignment
        )
        newSpecialAssignment._id = insertedId
        newSpecialAssignments.push(newSpecialAssignment)
      }

      return { SpecialAssignment: newSpecialAssignments }
    },
  }
)
