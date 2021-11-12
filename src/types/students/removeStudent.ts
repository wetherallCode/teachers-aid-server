import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const RemoveStudentInput = inputObjectType({
  name: 'RemoveStudentInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const RemoveStudentPayload = objectType({
  name: 'RemoveStudentPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveStudent = mutationField('removeStudent', {
  type: RemoveStudentPayload,
  args: { input: arg({ type: RemoveStudentInput, required: true }) },
  async resolve(
    _,
    { input: { studentId } },
    { studentData, assignmentData, protocolData, userData }
  ) {
    await assignmentData.deleteMany({ 'hasOwner._id': new ObjectId(studentId) })
    await protocolData.deleteMany({ 'student._id': new ObjectId(studentId) })
    await studentData.deleteMany({ 'student._id': new ObjectId(studentId) })
    await userData.deleteOne({ 'student._id': new ObjectId(studentId) })
    return { removed: true }
  },
})
