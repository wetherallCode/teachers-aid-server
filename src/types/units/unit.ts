import { inputObjectType, objectType } from '@nexus/schema'
import { Lesson } from '../lessons'

export const Unit = objectType({
  name: 'Unit',
  definition(t) {
    // @ts-ignore
    t.id('_id', { nullable: true })
    t.string('unitName')
    t.list.field('hasLessons', {
      type: Lesson,
      async resolve(parent, __, { lessonData }) {
        const lessons = await lessonData
          .find({ 'inUnit._id': parent._id })
          .toArray()
        return lessons
      },
    })
  },
})

export const UnitInput = inputObjectType({
  name: 'UnitInput',
  definition(t) {
    t.id('_id', { required: true })
    t.string('unitName', { required: true })
  },
})
