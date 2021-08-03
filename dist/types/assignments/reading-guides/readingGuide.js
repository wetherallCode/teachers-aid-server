"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationStructureEnum = exports.ReadingGuideFinalContainer = exports.ReadingGuide = void 0;
const schema_1 = require("@nexus/schema");
exports.ReadingGuide = schema_1.objectType({
    name: 'ReadingGuide',
    definition(t) {
        t.implements('Assignment');
        t.boolean('completed');
        t.boolean('graded');
        t.field('readingGuideFinal', {
            type: exports.ReadingGuideFinalContainer,
            nullable: true,
        });
    },
});
exports.ReadingGuideFinalContainer = schema_1.objectType({
    name: 'ReadingGuideFinalContainer',
    definition(t) {
        t.list.field('howIsSectionOrganized', {
            type: exports.InformationStructureEnum,
            nullable: true,
        });
        t.string('whyWasSectionOrganized', { nullable: true });
        t.string('majorIssue');
        t.boolean('majorIssueSolved');
        t.string('majorSolution');
        t.list.string('clarifyingQuestions');
        t.boolean('submitted');
        t.string('submitTime', { nullable: true });
    },
});
exports.InformationStructureEnum = schema_1.enumType({
    name: 'InformationStructureEnum',
    members: ['PROBLEM_SOLUTION', 'CAUSE_EFFECT', 'COMPARE_CONTRAST', 'SEQUENCE'],
});
//# sourceMappingURL=readingGuide.js.map