import { arg, inputObjectType, objectType, queryField } from '@nexus/schema'
import { ParentContact } from './parentContact'
import { ObjectId } from 'mongodb'

export const FindContactsByStudentIdInput = inputObjectType({
  name: 'FindContactsByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindContactsByStudentIdPayload = objectType({
  name: 'FindContactsByStudentIdPayload',
  definition(t) {
    t.list.field('parentContacts', { type: ParentContact })
  },
})

export const FindContactsByStudentId = queryField('findContactsByStudentId', {
  type: FindContactsByStudentIdPayload,
  args: { input: arg({ type: FindContactsByStudentIdInput, required: true }) },
  async resolve(_, { input: { studentId } }, { teacherData }) {
    const parentContacts = await teacherData
      .find({ 'student._id': new ObjectId(studentId) })
      .toArray()
    return { parentContacts }
  },
})
