import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ReadingGuide } from './readingGuide'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const AssignReadingGuidesInput = inputObjectType({
  name: 'AssignReadingGuidesInput',
  definition(t) {
    t.list.id('studentIds', { required: true })
    t.id('associatedLessonId', { required: true })
    t.date('assignedDate', { required: true })
    t.date('dueDate', { required: true })
  },
})

export const AssignReadingGuidesPayload = objectType({
  name: 'AssignReadingGuidesPayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const AssignReadingGuides = mutationField('assignReadingGuides', {
  type: AssignReadingGuidesPayload,
  args: { input: arg({ type: AssignReadingGuidesInput, required: true }) },
  async resolve(
    _,
    { input: { studentIds, associatedLessonId, assignedDate, dueDate } },
    { assignmentData, studentData }
  ) {
    const readingGuides: NexusGenRootTypes['ReadingGuide'][] = []

    for (const _id of studentIds) {
      const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] =
        await assignmentData.findOne({
          'hasOwner._id': new ObjectId(_id),
          associatedLessonId,
          articleTitle: { $exists: false },
          workingDraft: { $exists: false },
        })
      if (readingGuideValidation) {
        await assignmentData.updateOne(
          {
            'hasOwner._id': new ObjectId(_id),
            associatedLessonId,
            completed: { $exists: true },
          },
          {
            $set: {
              dueDate,
              assignedDate,
              assigned: true,
            },
          }
        )
        await studentData.updateOne(
          {
            'student._id': new ObjectId(_id),
            markingPeriod: readingGuideValidation.markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          {
            $inc: { responsibilityPoints: -2 },
          }
        )
      }

      const readingGuide: NexusGenRootTypes['ReadingGuide'] =
        await assignmentData.findOne({
          'hasOwner._id': new ObjectId(_id),
          associatedLessonId,
          completed: { $exists: true },
        })
      readingGuides.push(readingGuide)
    }
    return { readingGuides }
  },
})
