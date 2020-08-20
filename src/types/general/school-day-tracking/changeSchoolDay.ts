import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'


export const ChangeSchoolDayInput = inputObjectType({
    name: 'ChangeSchoolDayInput',
    definition(t) {
      t.('',{required: true})
    }
})

export const ChangeSchoolDayPayload = objectType({
  name: 'ChangeSchoolDayPayload',
  definition(t) {
    t.field('', { type:  })
  },
})

export const ChangeSchoolDay = queryField('changeSchoolDay', {
  type:ChangeSchoolDayPayload,
  args: { input: arg({ type: ChangeSchoolDayInput, required: true }) },
  async resolve(_, {input: {}}, {}) {
    
  },
});