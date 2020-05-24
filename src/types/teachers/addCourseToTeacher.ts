import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Teacher } from '.'
import { ObjectId } from 'mongodb'

export const AddCourseToTeacherInput = inputObjectType({
  name: 'AddCourseToTeacherInput',
  definition(t) {
    t.id('teacherId', { required: true })
    t.id('courseId', { required: true })
  },
})

export const AddCourseToTeacherPayload = objectType({
  name: 'AddCourseToTeacherPayload',
  definition(t) {
    t.field('teacher', { type: Teacher })
  },
})

export const AddCourseToTeacher = mutationField('addCourseToTeacher', {
  type: AddCourseToTeacherPayload,
  args: { input: arg({ type: AddCourseToTeacherInput, required: true }) },
  async resolve(
    _,
    { input: { teacherId, courseId } },
    { userData, courseData }
  ) {
    const course = await courseData.findOne({ _id: new ObjectId(courseId) })

    await userData.updateOne(
      { _id: new ObjectId(teacherId) },
      { $push: { teachesCourses: course } }
    )

    const updatedTeacher = await userData.findOne({
      _id: new ObjectId(teacherId),
    })
    return { teacher: updatedTeacher }
  },
})
