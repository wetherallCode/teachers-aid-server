import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const AssignEssaysInput = inputObjectType({
  name: 'AssignEssaysInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.id('associatedLessonId', { required: true })
    t.date('assignedDate', { required: true })

    t.date('dueDate', { required: true })
  },
})

export const AssignEssaysPayload = objectType({
  name: 'AssignEssaysPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const AssignEssays = mutationField('assignEssays', {
  type: AssignEssaysPayload,
  args: { input: arg({ type: AssignEssaysInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, associatedLessonId, assignedDate, dueDate } },
    { assignmentData, studentData }
  ) {
    const essays: NexusGenRootTypes['Essay'][] = []

    for (const _id of studentIds) {
      const essayValidation: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
        {
          'hasOwner._id': new ObjectId(_id),
          associatedLessonId,
          workingDraft: { $exists: true },
        }
      )

      if (essayValidation) {
        await assignmentData.updateOne(
          {
            'hasOwner._id': new ObjectId(_id),
            associatedLessonId,
            workingDraft: { $exists: true },
          },
          {
            $set: {
              dueDate,
              assignedDate, //have client put in currentDate
              assigned: true,
            },
          }
        )
        await studentData.updateOne(
          {
            'student._id': new ObjectId(_id),
            markingPeriod: essayValidation.markingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: { responsibilityPoints: -2 },
          }
        )
      }

      const essay = await assignmentData.findOne({
        'hasOwner._id': new ObjectId(_id),
        associatedLessonId,
        workingDraft: { $exists: true },
      })
      essays.push(essay)
    }
    return { essays }
  },
})
