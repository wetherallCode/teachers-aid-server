import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'
import {
  BehaviorCategoryEnum,
  BehaviorQualityEnum,
  BehaviorType,
} from './behaviorType'

export const CreateBehaviorTypeInput = inputObjectType({
  name: 'CreateBehaviorTypeInput',
  definition(t) {
    t.string('behaviorName', { required: true })
    t.field('behaviorQuality', { type: BehaviorQualityEnum, required: true })
    t.field('behaviorCategory', { type: BehaviorCategoryEnum, required: true })
    t.boolean('forTeachersAid', { required: true })
    t.int('points', { required: true })
  },
})

export const CreateBehaviorTypePayload = objectType({
  name: 'CreateBehaviorTypePayload',
  definition(t) {
    t.field('behaviorType', { type: BehaviorType })
  },
})

export const CreateBehaviorType = mutationField('createBehaviorType', {
  type: CreateBehaviorTypePayload,
  args: { input: arg({ type: CreateBehaviorTypeInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        behaviorName,
        behaviorCategory,
        behaviorQuality,
        points,
        forTeachersAid,
      },
    },
    { behaviorData }
  ) {
    const behaviorType: NexusGenRootTypes['BehaviorType'] = {
      behaviorName,
      behaviorQuality,
      behaviorCategory,
      points,
      forTeachersAid,
    }
    const { insertedId } = await behaviorData.insertOne(behaviorType)

    behaviorType._id = insertedId

    return { behaviorType }
  },
})
