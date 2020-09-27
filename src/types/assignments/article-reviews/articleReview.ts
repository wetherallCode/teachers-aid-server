import { objectType } from '@nexus/schema'
import { Score } from '..'
import { Student, Teacher, MarkingPeriodEnum } from '../..'

export const ArticleReview = objectType({
  name: 'ArticleReview',
  definition(t) {
    // t.implements('Assignment')
    t.id('_id', { nullable: true })
    t.field('hasOwner', { type: Student })
    t.field('hasAssigner', { type: Teacher })
    t.field('score', { type: Score })
    t.field('markingPeriod', { type: MarkingPeriodEnum })
    t.string('dueTime')
    t.string('assignedDate')
    t.boolean('paperBased')
    t.boolean('assigned')
    t.string('dueDate')
    t.boolean('late')
    t.boolean('exempt')
    t.boolean('completed')
    t.boolean('submitted')
    t.boolean('returned')
    t.string('articleTitle')
    t.string('articleAuthor')
    t.string('publishedDate', { nullable: true })
    t.string('articleLink')
    t.string('issue')
    t.boolean('bias', { nullable: true })
    t.string('solutions', { nullable: true })
    t.string('topicsImportance')
  },
})
