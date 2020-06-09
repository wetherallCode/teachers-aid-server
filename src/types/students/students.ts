import { objectType } from '@nexus/schema'
import { User } from '../users'
import { Course } from '..'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ExcusedLateness } from './excusedLateness'
import { resolve } from 'dns'
import { ResponsibilityPoints } from './responsibilityPoints'

export const Student = objectType({
  name: 'Student',
  definition(t) {
    t.implements(User)
    t.list.field('hasAssignments', {
      type: 'Assignment',
      async resolve(parent, __, { assignmentData }) {
        const assignments = await assignmentData
          .find({ 'hasOwner.userName': parent.userName })
          .toArray()

        return assignments
      },
    })
    t.list.field('inCourses', { type: Course })
    t.list.field('hasAbsences', {
      type: 'StudentAbsence',
      async resolve(parent, __, { studentData }) {
        const absences: NexusGenRootTypes['StudentAbsence'][] = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            daysAbsent: { $exists: true },
          })
          .toArray()
        return absences
      },
    })
    t.list.field('hasExcusedLatenesses', {
      type: 'ExcusedLateness',
      async resolve(parent, __, { studentData }) {
        const excusedLatenesses: NexusGenRootTypes['ExcusedLateness'][] = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            dayLateExcused: { $exists: true },
          })
          .toArray()
        return excusedLatenesses
      },
    })
    t.list.field('hasUnExcusedLatenesses', {
      type: 'UnexcusedLateness',
      async resolve(parent, __, { studentData }) {
        const unexcusedLatenesses: NexusGenRootTypes['UnexcusedLateness'][] = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            dayLate: { $exists: true },
          })
          .toArray()
        return unexcusedLatenesses
      },
    })
    t.list.field('hasResponsibilityPoints', {
      type: ResponsibilityPoints,
      async resolve(parent, __, { studentData }) {
        const responsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'][] = await studentData
          .find({
            'student._id': new ObjectId(parent._id!),
            responsibilityPoints: { $exists: true },
          })
          .toArray()
        return responsibilityPoints
      },
    })
  },
})
