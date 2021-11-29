import { inputObjectType, objectType, arg, mutationField } from '@nexus/schema'
import { ObjectID } from 'mongodb'

// export const ChangeVocabWordInput = inputObjectType({
//   name: 'ChangeVocabWordInput',
//   definition(t) {
//    t.id('sectionId', {required: true})
//    t.
//   },
// })
export const EmergencyModificationPayload = objectType({
	name: 'EmergencyModificationPayload',
	definition(t) {
		t.boolean('modified')
	},
})

export const EmergencyModification = mutationField('emergencyModification', {
	type: EmergencyModificationPayload,
	//   args: { input: arg({ type: ChangeVocabWordInput, required: true }) },
	async resolve(_, __, { textData }) {
		await textData.updateOne(
			{
				_id: new ObjectID('5fc78e965dd1940025fd32c3'),
			},
			{
				$set: {
					'fromChapter._id': new ObjectID('5fc4d9c286d75cb9d13e1511'),
				},
			}
		)

		return { modified: true }
	},
})
