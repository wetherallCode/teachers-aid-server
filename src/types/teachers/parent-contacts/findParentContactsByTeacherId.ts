import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ParentContact } from './parentContact'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindParentContactsByTeacherIdInput = inputObjectType({
  name: 'FindParentContactsByTeacherIdInput',
  definition(t) {
    t.id('teacherId', { required: true })
  },
})

export const FindParentContactsByTeacherIdPayload = objectType({
  name: 'FindParentContactsByTeacherIdPayload',
  definition(t) {
    t.list.field('parentContacts', { type: ParentContact })
  },
})

export const FindParentContactsByTeacherId = queryField(
  'findParentContactsByTeacherId',
  {
    type: FindParentContactsByTeacherIdPayload,
    args: {
      input: arg({ type: FindParentContactsByTeacherIdInput, required: true }),
    },
    async resolve(_, { input: { teacherId } }, { teacherData }) {
      const parentContacts: NexusGenRootTypes['ParentContact'][] = await teacherData
        .find({ teacherId: teacherId })
        .toArray()
      return { parentContacts }
    },
  }
)
