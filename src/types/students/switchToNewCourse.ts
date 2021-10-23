import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { updateLanguageServiceSourceFile } from 'typescript'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const SwitchToNewCourseInput = inputObjectType({
  name: 'SwitchToNewCourseInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.id('newCourseId', { required: true })
  },
})

export const SwitchToNewCoursePayload = objectType({
  name: 'SwitchToNewCoursePayload',
  definition(t) {
    t.boolean('switched')
  },
})

export const SwitchToNewCourse = mutationField('switchToNewCourse', {
  type: SwitchToNewCoursePayload,
  args: { input: arg({ type: SwitchToNewCourseInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, newCourseId } },
    { studentData, courseData, assignmentData, protocolData, userData }
  ) {
    const newCourse: NexusGenRootTypes['Course'] = await courseData.findOne({
      _id: new ObjectId(newCourseId),
    })

    await assignmentData.updateMany(
      { 'hasOwner._id': new ObjectId(studentId) },
      { $set: { 'hasOwner.inCourses.0': newCourse } }
    )
    await protocolData.updateMany(
      { 'student._id': new ObjectId(studentId) },
      { $set: { 'student.inCourses.0': newCourse } }
    )
    await studentData.updateMany(
      { 'student._id': new ObjectId(studentId) },
      { $set: { 'student.inCourses.0': newCourse } }
    )
    await studentData.updateMany(
      { 'student._id': new ObjectId(studentId), inCourse: { $exists: true } },
      { $set: { inCourse: newCourse } }
    )
    await userData.updateMany(
      { _id: new ObjectId(studentId) },
      { $set: { 'inCourses.0': newCourse } }
    )
    return { switched: true }
  },
})
