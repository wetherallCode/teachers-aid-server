import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ContactTypeEnum, ParentContact } from '.'

export const UpdateParentContactInput = inputObjectType({
  name: 'UpdateParentContactInput',
  definition(t) {
    t.id('contactId', { required: true })
    t.field('contactType', { type: ContactTypeEnum, required: true })
    t.string('date', { required: true })
    t.id('studentId', { required: true })
    t.string('contentOfContact', { required: true })
    t.id('teacherId', { required: true })
  },
})

export const UpdateParentContactPayload = objectType({
  name: 'UpdateParentContactPayload',
  definition(t) {
    t.field('parentContact', { type: ParentContact })
  },
})

export const UpdateParentContact = mutationField('updateParentContact', {
  type: UpdateParentContactPayload,
  args: { input: arg({ type: UpdateParentContactInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        contactId,
        contactType,
        studentId,
        date,
        contentOfContact,
        teacherId,
      },
    },
    { teacherData }
  ) {
    const parentContactCheck = await teacherData.findOne({
      _id: new ObjectId(contactId),
    })
    if (parentContactCheck) {
      await teacherData.updateOne(
        { _id: new ObjectId(contactId) },
        {
          contactType,
          date,
          studentId,
          contentOfContact,
          teacherId,
        }
      )
      const parentContact = await teacherData.findOne({
        _id: new ObjectId(contactId),
      })
      return { parentContact }
    } else throw new Error('This Contact does not exist')
  },
})
