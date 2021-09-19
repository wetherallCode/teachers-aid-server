import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { BehaviorEnum, StudentBehavior } from '.'

export const CreateStudentBehaviorInput = inputObjectType({
  name: 'CreateStudentBehaviorInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.field('studentBehaviorType', { type: BehaviorEnum, required: true })
  },
})

export const CreateStudentBehaviorPayload = objectType({
  name: 'CreateStudentBehaviorPayload',
  definition(t) {
    t.field('studentBehavior', { type: StudentBehavior })
  },
})

export const CreateStudentBehavior = mutationField('createStudentBehavior', {
  type: CreateStudentBehaviorPayload,
  args: { input: arg({ type: CreateStudentBehaviorInput, required: true }) },
  async resolve(
    _,
    { input: { studentId, studentBehaviorType } },
    { studentData, userData }
  ) {
    const studentCheck: NexusGenRootTypes['Student'] = await userData.findOne({
      _id: studentId,
    })
    if (studentCheck) {
      const studentBehavior: NexusGenRootTypes['StudentBehavior'] = {
        behavior: studentBehaviorType,
        date: new Date().toLocaleDateString(),
        student: studentCheck,
      }
      const { insertedId } = await studentData.insertOne(studentBehavior)
      studentBehavior._id = insertedId

      return { studentBehavior }
    } else throw new Error('Student does not exist.')
  },
})
