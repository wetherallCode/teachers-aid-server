import { objectType, inputObjectType, mutationField, arg } from '@nexus/schema'
import { Student } from './students'
import { ObjectId } from 'mongodb'

export const AddStudentToCourseInput = inputObjectType({
  name: 'AddStudentToCourseInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.id('courseId', { required: true })
  },
})

export const AddStudentToCoursePayload = objectType({
  name: 'AddStudentToCoursePayload',
  definition(t) {
    t.field('student', { type: Student })
  },
})

export const AddStudentToCourse = mutationField('addStudentToCourse', {
  type: AddStudentToCoursePayload,
  args: { input: arg({ type: AddStudentToCourseInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, courseId } },
    { userData, courseData }
  ) {
    const course = await courseData.findOne({ _id: new ObjectId(courseId) })

    await userData.updateOne(
      { _id: new ObjectId(studentId) },
      { $push: { inCourses: course } }
    )

    const updatedStudent = await userData.findOne({
      _id: new ObjectId(studentId),
    })
    return { student: updatedStudent }
  },
})
