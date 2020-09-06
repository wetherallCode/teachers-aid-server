import { objectType, inputObjectType, mutationField, arg } from '@nexus/schema'
import { Student } from './student'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const AddStudentsToCourseInput = inputObjectType({
  name: 'AddStudentsToCourseInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.id('courseId', { required: true })
  },
})

export const AddStudentsToCoursePayload = objectType({
  name: 'AddStudentsToCoursePayload',
  definition(t) {
    t.list.field('students', { type: Student })
  },
})

export const AddStudentsToCourse = mutationField('addStudentsToCourse', {
  type: AddStudentsToCoursePayload,
  args: { input: arg({ type: AddStudentsToCourseInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, courseId } },
    { userData, courseData }
  ) {
    const course = await courseData.findOne({ _id: new ObjectId(courseId) })
    if (!course) throw new Error('Course does not exist!')

    const students: NexusGenRootTypes['Student'][] = []
    const updatedStudents: NexusGenRootTypes['Student'][] = []

    const studentsAlreadyAssignedToCourse: NexusGenRootTypes['Student'][] = []

    for (const _id of studentIds) {
      const student: NexusGenRootTypes['Student'] = await userData.findOne({
        _id: new ObjectId(_id),
      })

      if (
        student.inCourses.some(
          (studentCourses) =>
            studentCourses._id?.toString() === course._id.toString()
        )
      ) {
        studentsAlreadyAssignedToCourse.push(student)
      } else students.push(student)
    }

    for (const student of students) {
      await userData.updateOne(
        { _id: new ObjectId(student._id!) },
        { $push: { inCourses: course } }
      )
      // const
      const updatedStudent = await userData.findOne({
        _id: new ObjectId(student._id!),
      })
      updatedStudents.push(updatedStudent)
    }

    return { students: updatedStudents }
  },
})
