import { objectType } from '@nexus/schema'
import { QuestionPartsContainer } from '../../assignments'
import { QuestionTypeEnum } from '../../texts/textSections'
import { QuestionUsageTypeEnum } from '../question'

export const EssayQuestion = objectType({
  name: 'EssayQuestion',
  definition(t) {
    t.implements('Question')
    t.field('questionParts', { type: QuestionPartsContainer })
    t.field('questionUsageType', { type: QuestionUsageTypeEnum })
    t.list.id('associatedTextSectionsIds')
  },
})
