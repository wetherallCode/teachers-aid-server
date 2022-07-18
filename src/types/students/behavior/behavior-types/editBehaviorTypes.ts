import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import {
  BehaviorCategoryEnum,
  BehaviorQualityEnum,
  BehaviorType,
} from './behaviorType'

export const EditBehaviorTypesInput = inputObjectType({
  name: 'EditBehaviorTypesInput',
  definition(t) {
    t.id('behaviorTypeId', { required: true })
    t.string('behaviorName', { required: true })
    t.field('behaviorQuality', { type: BehaviorQualityEnum, required: true })
    t.field('behaviorCategory', { type: BehaviorCategoryEnum, required: true })
    t.boolean('forTeachersAid', { required: true })
    t.int('points', { required: true })
  },
})

export const EditBehaviorTypesPayload = objectType({
  name: 'EditBehaviorTypesPayload',
  definition(t) {
    t.boolean('updated')
  },
})

export const EditBehaviorTypes = mutationField('editBehaviorTypes', {
  type: EditBehaviorTypesPayload,
  args: { input: arg({ type: EditBehaviorTypesInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        behaviorTypeId,
        behaviorName,
        behaviorCategory,
        behaviorQuality,
        points,
        forTeachersAid,
      },
    },
    { behaviorData }
  ) {
    const behaviorTypeValid = await behaviorData.findOne({
      _id: new ObjectId(behaviorTypeId),
    })
    if (behaviorTypeValid) {
      const { modifiedCount } = await behaviorData.updateOne(
        { _id: new ObjectId(behaviorTypeId) },
        {
          $set: {
            behaviorName,
            behaviorQuality,
            behaviorCategory,
            points,
            forTeachersAid,
          },
        }
      )
      return { updated: modifiedCount === 1 ? true : false }
    } else throw new Error('Behavior Type does not exist.')
  },
})
