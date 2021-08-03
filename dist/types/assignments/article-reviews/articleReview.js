"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleReview = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const __2 = require("../..");
exports.ArticleReview = schema_1.objectType({
    name: 'ArticleReview',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('hasOwner', { type: __2.Student });
        t.field('hasAssigner', { type: __2.Teacher });
        t.field('score', { type: __1.Score });
        t.field('markingPeriod', { type: __2.MarkingPeriodEnum });
        t.string('dueTime');
        t.string('assignedDate');
        t.boolean('paperBased');
        t.boolean('assigned');
        t.string('dueDate');
        t.boolean('late');
        t.boolean('exempt');
        t.boolean('completed');
        t.boolean('submitted');
        t.boolean('returned');
        t.string('articleTitle');
        t.string('articleAuthor');
        t.string('publishedDate', { nullable: true });
        t.string('articleLink');
        t.string('issue');
        t.boolean('bias', { nullable: true });
        t.string('solutions', { nullable: true });
        t.string('topicsImportance');
    },
});
//# sourceMappingURL=articleReview.js.map