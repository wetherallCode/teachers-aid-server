import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindEssayByStudentIdAndLessonIdInput = inputObjectType({
  name: 'FindEssayByStudentIdAndLessonIdInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.id('lessonId')
  },
})

export const FindEssayByStudentIdAndLessonIdPayload = objectType({
  name: 'FindEssayByStudentIdAndLessonIdPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const FindEssayByStudentIdAndLessonId = queryField(
  'findEssayByStudentIdAndLessonId',
  {
    type: FindEssayByStudentIdAndLessonIdPayload,
    args: {
      input: arg({
        type: FindEssayByStudentIdAndLessonIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId, lessonId } }, { assignmentData }) {
      const essay: NexusGenRootTypes['Essay'] = await assignmentData.findOne({
        'hasOwner._id': studentId,
        associatedLessonId: lessonId,
        workingDraft: { $exists: true },
      })
      return { essay }
    },
  }
)
