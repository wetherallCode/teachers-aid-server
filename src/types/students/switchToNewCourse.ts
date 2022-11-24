import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { Student } from './student'

export const SwitchToNewCourseInput = inputObjectType({
  name: 'SwitchToNewCourseInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.id('newCourseId', { required: true })
    t.id('oldCourseId', { required: true })
  },
})

export const SwitchToNewCoursePayload = objectType({
  name: 'SwitchToNewCoursePayload',
  definition(t) {
    t.field('student', { type: Student })
  },
})

export const SwitchToNewCourse = mutationField('switchToNewCourse', {
  type: SwitchToNewCoursePayload,
  args: { input: arg({ type: SwitchToNewCourseInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, newCourseId, oldCourseId } },
    { studentData, courseData, assignmentData, protocolData, userData }
  ) {
    const newCourse: NexusGenRootTypes['Course'] = await courseData.findOne({
      _id: new ObjectId(newCourseId),
    })
    const oldCourse: NexusGenRootTypes['Course'] = await courseData.findOne({
      _id: new ObjectId(oldCourseId),
    })

    const studentToFind: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: new ObjectId(studentId),
    })
    if (studentToFind) {
      const { name } = studentToFind.inCourses[0]!

      const { modifiedCount: assignmentCount } =
        await assignmentData.updateMany(
          {
            'hasOwner._id': new ObjectId(studentId),
            'hasOwner.inCourses': oldCourse,
          },
          { $set: { 'hasOwner.inCourses.$': newCourse } }
        )
      console.log('assignmentCount, ' + assignmentCount)
      const { modifiedCount: protocolCount } = await protocolData.updateMany(
        {
          'student._id': new ObjectId(studentId),
          'student.inCourses': oldCourse,
        },
        { $set: { 'student.inCourses.$': newCourse } }
      )
      console.log('protocolCount, ' + protocolCount)
      const { modifiedCount: studentDataCount } = await studentData.updateMany(
        {
          'student._id': new ObjectId(studentId),
          'student.inCourses': oldCourse,
        },
        { $set: { 'student.inCourses.$': newCourse } }
      )
      console.log('studentDataCount, ' + studentDataCount)

      const { modifiedCount: studentDataMetricsCount } =
        await studentData.updateMany(
          {
            'student._id': new ObjectId(studentId),
            inCourse: { $exists: true },
            // 'student.inCourses':oldCourse,
          },
          { $set: { inCourse: newCourse } }
        )
      console.log('studentDataMetricsCount, ' + studentDataMetricsCount)

      await userData.updateMany(
        { _id: new ObjectId(studentId) },
        { $set: { 'inCourses.0': newCourse } }
      )
      const student = await userData.findOne({ _id: new ObjectId(studentId) })
      return { student }
    }
    throw new Error('wait')
  },
})
