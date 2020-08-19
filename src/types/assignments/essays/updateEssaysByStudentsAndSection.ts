import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { MarkingPeriodEnum } from '../../general'

export const UpdateEssaysByStudentsAndSectionInput = inputObjectType({
  name: 'UpdateEssaysByStudentsAndSectionInput',
  definition(t) {
    t.list.id('studentId', { required: true })
    t.string('section', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.string('dueTime', { required: true })
    t.date('assignedDate', { required: true })
    t.date('dueDate', { required: true })
    t.int('maxPoints', { required: true })
  },
})

export const UpdateEssaysByStudentsAndSectionPayload = objectType({
  name: 'UpdateEssaysByStudentsAndSectionPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const UpdateEssaysByStudentsAndSection = mutationField(
  'updateEssaysByStudentsAndSection',
  {
    type: UpdateEssaysByStudentsAndSectionPayload,
    description: 'For updating an assignment for an entire course(s)',
    args: {
      input: arg({
        type: UpdateEssaysByStudentsAndSectionInput,
        required: true,
      }),
    },
    async resolve(
      _,
      {
        input: {
          studentId,
          section,
          markingPeriod,
          dueTime,
          dueDate,
          assignedDate,
          maxPoints,
        },
      },
      { assignmentData }
    ) {
      const essays: NexusGenRootTypes['Essay'][] = []
      const studentIdsWithNoEssay: string[] = []

      for (const _id of studentId) {
        const essayValidation: NexusGenRootTypes['Essay'][] = await assignmentData.findOne(
          {
            'hasOwner._id': new ObjectId(_id),
            'readings.readingSections': section,
            workingDraft: { $exists: true },
          }
        )
        if (essayValidation) {
          await assignmentData.updateOne(
            {
              'hasOwner._id': new ObjectId(_id),
              'readings.readingSections': section,
              workingDraft: { $exists: true },
            },
            {
              $set: {
                markingPeriod,
                dueTime,
                dueDate,
                assignedDate,
                'score.maxPoints': maxPoints,
              },
            }
          )
        }
        const essay = await assignmentData.findOne({
          'hasOwner._id': new ObjectId(_id),
          'readings.readingSections': section,
          workingDraft: { $exists: true },
        })
        essays.push(essay)
      }
      return { essays }
    },
  }
)
