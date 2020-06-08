import { objectType, inputObjectType, enumType } from '@nexus/schema'
import { Teacher, Student } from '..'
import { ObjectId } from 'mongodb'

export const Course = objectType({
  name: 'Course',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('period')
    t.field('hasTeacher', {
      type: Teacher,
      async resolve(parent, __, { userData }) {
        console.log(parent._id)
        const teacher = await userData.findOne({
          'teachesCourses._id': new ObjectId(parent._id!),
        })
        return teacher
      },
    })
    // t.list.field('hasStudents', { type: Student })
    t.list.field('hasStudents', {
      type: Student,
      async resolve(parent, __, { userData }) {
        const students = await userData
          .find({ 'inCourses._id': new ObjectId(parent._id!) })
          .toArray()
        return students
      },
    })
    // t.list.field('hasLessons', {
    //   type: Student,
    //   async resolve(parent, __, { lessonData }) {
    //     const lessons = await lessonData.find({ has: new ObjectId(parent._id) })
    //   },
    // })
  },
})

export const CourseInput = inputObjectType({
  name: 'CourseInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('period')
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
