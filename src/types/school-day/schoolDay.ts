import { objectType } from '@nexus/schema'
import { SchoolDayType } from './schoolDayType'
import { StudentCohortEnum, Student } from '../students'
import { Course } from '..'
import { StudentQuestions } from '../general'

export const SchoolDay = objectType({
  name: 'SchoolDay',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('todaysDate')
    t.field('currentSchoolDayType', { type: SchoolDayType })
    t.int('schoolDayCount')
    t.field('cohortWeek', { type: StudentCohortEnum })
    t.list.field('signInSheets', {
      type: StudentSignInSheet,
      nullable: true,
    })
    // t.list.field('hasStudentQuestions', {
    //   type: StudentQuestions,
    //   async resolve(parent, __, schoolDayData) {
    //     const studentQuestions = await schoolDayData
    //       .find({
    //         associatedSchoolDayId: parent._id,
    //       })
    //       .toArray()
    //     return studentQuestions
    //   },
    // })
  },
})

export const StudentSignInSheet = objectType({
  name: 'StudentSignInSheet',
  definition(t) {
    t.field('course', { type: Course })
    t.list.field('studentsSignInlog', {
      type: Student,
      nullable: true,
    })
    t.date('lessonDate')
  },
})
