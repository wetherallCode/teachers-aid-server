import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ProfessionalDevelopment } from './professionalDevelopment'

export const CreateProfessionalDevelopmentInput = inputObjectType({
  name: 'CreateProfessionalDevelopmentInput',
  definition(t) {
    t.string('name', { required: true })
    t.string('date', { required: true })
    t.float('developmentHours', { required: true })
  },
})

export const CreateProfessionalDevelopmentPayload = objectType({
  name: 'CreateProfessionalDevelopmentPayload',
  definition(t) {
    t.field('professionalDevelopment', { type: ProfessionalDevelopment })
  },
})

export const CreateProfessionalDevelopment = mutationField(
  'createProfessionalDevelopment',
  {
    type: CreateProfessionalDevelopmentPayload,
    args: {
      input: arg({ type: CreateProfessionalDevelopmentInput, required: true }),
    },
    async resolve(
      _,
      { input: { name, date, developmentHours } },
      { teacherData }
    ) {
      const newProfessionalDevelopment: NexusGenRootTypes['ProfessionalDevelopment'] =
        {
          date,
          developmentHours,
          name,
        }

      const { insertedId } = await teacherData.insertOne(
        newProfessionalDevelopment
      )
      newProfessionalDevelopment._id = insertedId

      return { professionalDevelopment: newProfessionalDevelopment }
    },
  }
)
