import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Assignment } from './assignments'
import { ObjectId } from 'mongodb'

export const FindAssignmentByIdInput = inputObjectType({
  name: 'FindAssignmentByIdInput',
  definition(t) {
    t.id('assignmentId', { required: true })
  },
})

export const FindAssignmentByIdPayload = objectType({
  name: 'FindAssignmentByIdPayload',
  definition(t) {
    t.field('assignment', { type: Assignment })
  },
})

export const FindAssignmentById = queryField('findAssignmentById', {
  type: FindAssignmentByIdPayload,
  args: { input: arg({ type: FindAssignmentByIdInput, required: true }) },
  async resolve(_, { input: { assignmentId } }, { assignmentData }) {
    const assignment = await assignmentData.findOne({
      _id: new ObjectId(assignmentId),
    })
    return { assignment }
  },
})
