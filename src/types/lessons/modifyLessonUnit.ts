import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const ModifyLessonUnitInput = inputObjectType({
  name: 'ModifyLessonUnitInput',
  definition(t) {
    t.string('assignedDate', { required: true })
    t.id('newUnitId', { required: true })
  },
})

export const ModifyLessonUnitPayload = objectType({
  name: 'ModifyLessonUnitPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyLessonUnit = mutationField('modifyLessonUnit', {
  type: ModifyLessonUnitPayload,
  args: { input: arg({ type: ModifyLessonUnitInput, required: true }) },
  async resolve(_, { input: { assignedDate, newUnitId } }, { lessonData }) {
    const newUnit = await lessonData.findOne({ _id: new ObjectId(newUnitId) })
    const { modifiedCount } = lessonData.updateMany(
      { assignedDate },
      { $set: { inUnit: newUnit } }
    )
    return { modified: modifiedCount === 6 ? true : false }
  },
})
