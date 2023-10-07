import { objectType, enumType } from '@nexus/schema'
import { User } from '../users'
import { Course, WritingMetrics, StudentQuestion } from '..'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ResponsibilityPoints } from './responsibilityPoints/responsibilityPoints'
import { StudentBehavior, StudentCohortEnum, StudentOutOfClass } from '.'

export const StudentForTeachersAid = objectType({
  name: 'StudentForTeachersAid',
  definition(t) {
    t.implements(User)
    t.string('schoolId', { nullable: true })
    t.boolean('hasIEP', { nullable: true })
    t.boolean('virtual')
    t.field('cohort', { type: StudentCohortEnum })
    // t.list.field('asksQuestions', {
    //   type: StudentQuestion,
    //   async resolve(parent, __, { schoolDayData }) {
    //     const studentQuestions: NexusGenRootTypes['StudentQuestions'] = await schoolDayData
    //       .find({ 'questions.studentId': new ObjectId(parent._id!) })
    //       .toArray()

    //     const questions = studentQuestions.questions.filter(
    //       (question) => question.studentId === parent._id
    //     )
    //     return questions
    //   },
    // })
    t.list.field('hasAssignments', {
      type: 'Assignment',
      async resolve(parent, __, { assignmentData }) {
        const assignments: NexusGenRootTypes['Assignment'][] =
          await assignmentData
            .find({
              'hasOwner._id': new ObjectId(parent._id!),
              // articleTitle: { $exists: false },
              assignedDate: new Date().toLocaleDateString(),
            })
            .toArray()

        return assignments
      },
    })
    t.list.field('hasProtocols', {
      type: 'Protocol',
      async resolve(parent, __, { protocolData }) {
        const protocols: NexusGenRootTypes['Protocol'][] = await protocolData
          .find({
            'student._id': new ObjectId(parent._id!),
            assignedDate: new Date().toLocaleDateString(),
          })
          .toArray()

        return protocols
      },
    })
    t.list.field('inCourses', { type: Course })
    t.list.field('hasAbsences', {
      type: 'StudentAbsence',
      async resolve(parent, __, { studentData }) {
        const absences: NexusGenRootTypes['StudentAbsence'][] =
          await studentData
            .find({
              'student._id': new ObjectId(parent._id!),
              dayAbsent: new Date().toLocaleDateString(),
            })
            .toArray()
        return absences
      },
    })
    t.list.field('hasLatnesses', {
      type: 'StudentLateness',
      async resolve(parent, __, { studentData }) {
        const lateness: NexusGenRootTypes['StudentLateness'][] =
          await studentData
            .find({
              'student._id': new ObjectId(parent._id!),
              dayLate: { $exists: true },
            })
            .toArray()
        return lateness
      },
    })
    t.list.field('hasExcusedLatenesses', {
      type: 'ExcusedLateness',
      async resolve(parent, __, { studentData }) {
        const excusedLatenesses: NexusGenRootTypes['ExcusedLateness'][] =
          await studentData
            .find({
              'student._id': new ObjectId(parent._id!),
              dayLateExcused: new Date().toLocaleDateString(),
            })
            .toArray()
        return excusedLatenesses
      },
    })
    t.list.field('hasUnExcusedLatenesses', {
      type: 'UnexcusedLateness',
      async resolve(parent, __, { studentData }) {
        const unexcusedLatenesses: NexusGenRootTypes['UnexcusedLateness'][] =
          await studentData
            .find({
              'student._id': new ObjectId(parent._id!),
              dayLate: new Date().toLocaleDateString(),
            })
            .toArray()
        return unexcusedLatenesses
      },
    })
    t.field('hasResponsibilityPoints', {
      type: ResponsibilityPoints,
      async resolve(parent, __, { studentData, generalData }) {
        const { currentMarkingPeriod } = await generalData.findOne({
          currentMarkingPeriod: { $exists: true },
        })

        const responsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'] =
          await studentData.findOne({
            'student._id': new ObjectId(parent._id!),
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
            markingPeriod: currentMarkingPeriod,
          })

        return responsibilityPoints
      },
    })
    // t.field('hasWritingMetrics', {
    //   type: WritingMetrics,
    //   async resolve(parent, __, { studentData }) {
    //     const writingMetrics = await studentData.findOne({
    //       'student._id': new ObjectId(parent._id!),
    //       howProblemSolutionMetrics: { $exists: true },
    //     })
    //     return writingMetrics
    //   },
    // })
    t.list.field('hasBehaviors', {
      type: StudentBehavior,
      async resolve(parent, __, { studentData }) {
        const studentBehaviors = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            behavior: { $exists: true },
            date: new Date().toLocaleDateString(),
          })
          .toArray()
        return studentBehaviors
      },
    })
    t.list.field('hasStatus', {
      type: StudentOutOfClass,
      async resolve(parent, __, { studentData }) {
        const studentOutOfClass = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            outOfClassDestination: { $exists: true },
            date: new Date().toLocaleDateString(),
          })
          .toArray()

        return studentOutOfClass
      },
    })
    t.list.field('hasStatuses', {
      type: StudentOutOfClass,
      async resolve(parent, __, { studentData }) {
        const studentOutOfClass = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            outOfClassDestination: { $exists: true },
          })
          .toArray()

        return studentOutOfClass
      },
    })
  },
})
