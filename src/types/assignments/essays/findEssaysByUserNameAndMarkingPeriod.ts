import { queryField, inputObjectType, objectType, arg } from '@nexus/schema'
import { Essay } from '.'
import { MarkingPeriodEnum } from '../../general'

// find an essay by userName
export const FindEssaysByUserNameAndMarkingPeriodInput = inputObjectType({
  name: 'FindEssaysByUserNameAndMarkingPeriodInput',
  definition(t) {
    t.string('userName', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const FindEssaysByUserNameAndMarkingPeriodPayload = objectType({
  name: 'FindEssaysByUserNameAndMarkingPeriodPayload',
  definition(t) {
    t.list.field('essay', { type: Essay, nullable: true })
  },
})

export const FindEssaysByUserNameAndMarkingPeriod = queryField(
  'findEssaysByUserNameAndMarkingPeriod',
  {
    type: FindEssaysByUserNameAndMarkingPeriodPayload,
    args: {
      input: arg({
        type: FindEssaysByUserNameAndMarkingPeriodInput,
        required: true,
      }),
    },
    async resolve(
      _,
      { input: { userName, markingPeriod } },
      { assignmentData }
    ) {
      const essay = await assignmentData
        .find({
          'hasOwner.userName': userName,
          markingPeriod,
        })
        .toArray()
      return { essay }
    },
  }
)
