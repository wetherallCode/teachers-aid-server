import { objectType, inputObjectType, enumType } from '@nexus/schema'
import { Teacher, Student, StudentSignInSheet } from '..'
import { ObjectId } from 'mongodb'
import { Lesson } from '../lessons'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { CourseInfo } from './courseInfo'
import { resolve } from 'path'

export const Course = objectType({
  name: 'Course',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('name')
    t.field('hasCourseInfo', {
      type: CourseInfo,
      async resolve(parent, __, { courseData }) {
        const info = await courseData.findOne({
          'course._id': parent._id!,
        })
        return info
      },
      nullable: true,
    })
    t.field('hasTeacher', {
      type: Teacher,
      async resolve(parent, __, { userData }) {
        const teacher = await userData.findOne({
          'teachesCourses._id': new ObjectId(parent._id!),
        })
        return teacher
      },
    })
    t.list.field('hasSignInSheets', {
      type: StudentSignInSheet,
      async resolve(parent, __, { schoolDayData }) {
        const schoolDay: NexusGenRootTypes['SchoolDay'][] = await schoolDayData
          .find({
            'signInSheets.course._id': new ObjectId(parent._id!),
          })
          .toArray()

        const StudentSignInSheetList: NexusGenRootTypes['StudentSignInSheet'][] = []

        schoolDay.forEach((day) => {
          const { signInSheets } = day
          signInSheets?.forEach(
            (sheet: NexusGenRootTypes['StudentSignInSheet']) => {
              const signInsheet: NexusGenRootTypes['StudentSignInSheet'] = {
                course: sheet.course,
                lessonDate: sheet.lessonDate,
                studentsSignInlog: sheet.studentsSignInlog,
              }
              StudentSignInSheetList.push(signInsheet)
            }
          )
        })
        return StudentSignInSheetList
      },
    })
    t.list.field('hasStudents', {
      type: Student,
      async resolve(parent, __, { userData }) {
        const students = await userData
          .find({ 'inCourses._id': new ObjectId(parent._id!) })
          .toArray()
        return students
      },
    })
    t.list.field('hasLessons', {
      type: Lesson,
      async resolve(parent, __, { lessonData }) {
        const lessons: NexusGenRootTypes['Lesson'][] = await lessonData
          .find({
            'assignedCourses._id': new ObjectId(parent._id!),
          })
          .toArray()
        return lessons
      },
    })
  },
})

export const CourseInput = inputObjectType({
  name: 'CourseInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('name')
  },
})

export const CourseTypeEnum = enumType({
  name: 'CourseTypeEnum',
  members: [
    'SOCIAL_STUDIES',
    'ENGLISH_LANGUAGE_ARTS',
    'SCIENCE',
    'MATH',
    'RELATED_ARTS',
  ],
})
