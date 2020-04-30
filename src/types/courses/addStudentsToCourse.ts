import { objectType, inputObjectType, mutationField, arg } from '@nexus/schema'
import { Course } from '.'

export const AddStudentsToCourseInput = inputObjectType({
  name: 'AddStudentsToCourseInput',
  definition(t) {
    t.string('studentUserName', { required: true })
    t.string('course', { required: true })
  },
})

export const AddStudentsToCoursePayload = objectType({
  name: 'AddStudentsToCoursePayload',
  definition(t) {
    t.field('course', { type: Course })
  },
})

export const AddStudentsToCourse = mutationField('addStudentsToCourse', {
  type: AddStudentsToCoursePayload,
  args: { input: arg({ type: AddStudentsToCourseInput, required: true }) },
  async resolve(
    _,
    { input: { studentUserName, course } },
    { userData, courseData }
  ) {
    const addUserToCourse = await userData.findOne({
      userName: studentUserName,
    })

    await courseData.updateOne(
      { period: course },
      { $push: { hasStudents: addUserToCourse } }
    )

    const updatedCourse = await courseData.findOne({ period: course })
    return { course: updatedCourse }
  },
})
