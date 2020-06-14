"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.WritingMetrics = schema_1.objectType({
    name: 'WritingMetrics',
    definition(t) {
        t.typeName;
        t.implements('ProgressMetrics');
        t.field('overallWritingMetric', { type: exports.OverallWritingMetric });
        t.field('howProblemSolutionMetrics', { type: exports.HowProblemSolutionMetrics });
        t.field('howCauseEffectMetrics', { type: exports.HowCauseEffectMetrics });
        t.field('whyCauseEffectMetrics', { type: exports.WhyCauseEffectMetrics });
    },
});
exports.WritingLevelType = schema_1.enumType({
    name: 'WritingLevelType',
    members: ['DEVELOPING', 'ACADEMIC', 'ADVANCED'],
});
exports.OverallWritingMetric = schema_1.objectType({
    name: 'OverallWritingMetric',
    definition(t) {
        t.int('levelPoints');
        t.field('overallWritingLevel', { type: exports.WritingLevelType });
    },
});
exports.HowProblemSolutionMetrics = schema_1.objectType({
    name: 'HowProblemSolutionMetrics',
    definition(t) {
        t.int('levelPoints');
        t.field('howProblemSolutionLevel', { type: exports.WritingLevelType });
    },
});
exports.HowCauseEffectMetrics = schema_1.objectType({
    name: 'HowCauseEffectMetrics',
    definition(t) {
        t.int('levelPoints');
        t.field('howCauseEffectLevel', { type: exports.WritingLevelType });
    },
});
exports.WhyCauseEffectMetrics = schema_1.objectType({
    name: 'WhyCauseEffectMetrics',
    definition(t) {
        t.int('levelPoints');
        t.field('whyCauseEffectLevel', { type: exports.WritingLevelType });
    },
});
//# sourceMappingURL=writingMetrics.js.map