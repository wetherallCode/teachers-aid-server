import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { ContactTypeEnum, ParentContact } from '.'

export const CreateParentContactInput = inputObjectType({
  name: 'CreateParentContactInput',
  definition(t) {
    t.field('contactType', { type: ContactTypeEnum, required: true })
    t.string('date', { required: true })
    t.id('studentId', { required: true })
    t.string('contentOfContact', { required: true })
    t.id('teacherId', { required: true })
  },
})

export const CreateParentContactPayload = objectType({
  name: 'CreateParentContactPayload',
  definition(t) {
    t.field('parentContact', { type: ParentContact })
  },
})

export const CreateParentContact = mutationField('createParentContact', {
  type: CreateParentContactPayload,
  args: { input: arg({ type: CreateParentContactInput, required: true }) },
  async resolve(
    _,
    { input: { contactType, date, studentId, contentOfContact, teacherId } },
    { teacherData }
  ) {
    const newContact: NexusGenRootTypes['ParentContact'] = {
      contactType,
      date,
      studentId,
      teacherId,
      contentOfContact,
    }
    const { insertedId } = await teacherData.insertOne(newContact)
    newContact._id = insertedId

    return { parentContact: newContact }
  },
})
