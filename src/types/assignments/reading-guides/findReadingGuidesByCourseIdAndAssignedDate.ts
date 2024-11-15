import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ReadingGuide } from '.'

export const FindReadingGuidesByCourseIdAndAssignedDateInput = inputObjectType({
  name: 'FindReadingGuidesByCourseIdAndAssignedDateInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('assignedDate')
  },
})

export const FindReadingGuidesByCourseIdAndAssignedDatePayload = objectType({
  name: 'FindReadingGuidesByCourseIdAndAssignedDatePayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const FindReadingGuidesByCourseIdAndAssignedDate = queryField(
  'findReadingGuidesByCourseIdAndAssignedDate',
  {
    type: FindReadingGuidesByCourseIdAndAssignedDatePayload,
    args: {
      input: arg({
        type: FindReadingGuidesByCourseIdAndAssignedDateInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { courseId, assignedDate } },
      { assignmentData },
    ) {
      const readingGuides: NexusGenRootTypes['ReadingGuide'][] =
        await assignmentData
          .find({
            'hasOwner.inCourses._id': new ObjectId(courseId),
            assignedDate,
            workingDraft: { $exists: false },
            articleTitle: { $exists: false },
            quizzableSections: { $exists: false },
            textAnalysisCompletion: { $exists: false },
          })
          .toArray()

      return { readingGuides }
    },
  },
)
