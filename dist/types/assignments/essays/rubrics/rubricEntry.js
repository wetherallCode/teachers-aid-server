"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubricSectionEnum = exports.RubricEntryInput = exports.RubricEntry = void 0;
const schema_1 = require("@nexus/schema");
const writingMetrics_1 = require("../../../students/progress-metrics/writingMetrics");
exports.RubricEntry = schema_1.objectType({
    name: 'RubricEntry',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('entry');
        t.int('score');
        t.field('rubricSection', { type: exports.RubricSectionEnum });
        t.string('howToImprove', { nullable: true });
        t.list.field('rubricWritingLevels', { type: writingMetrics_1.WritingLevelEnum });
    },
});
exports.RubricEntryInput = schema_1.inputObjectType({
    name: 'RubricEntryInput',
    definition(t) {
        t.string('entry', { required: true });
        t.int('score', { required: true });
        t.field('rubricSection', { type: exports.RubricSectionEnum, required: true });
        t.list.field('rubricWritingLevels', {
            type: writingMetrics_1.WritingLevelEnum,
            required: true,
        });
    },
});
exports.RubricSectionEnum = schema_1.enumType({
    name: 'RubricSectionEnum',
    members: ['OVERALL', 'GENERAL', 'TOPIC', 'ANSWER', 'CONCLUSION'],
});
//# sourceMappingURL=rubricEntry.js.map