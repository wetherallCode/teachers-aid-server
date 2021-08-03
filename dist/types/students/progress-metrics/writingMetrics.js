"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhyCauseEffectMetrics = exports.HowCauseEffectMetrics = exports.HowProblemSolutionMetrics = exports.OverallWritingMetric = exports.WritingLevelEnum = exports.WritingMetrics = void 0;
const schema_1 = require("@nexus/schema");
const courses_1 = require("../../courses");
exports.WritingMetrics = schema_1.objectType({
    name: 'WritingMetrics',
    definition(t) {
        t.typeName;
        t.implements('ProgressMetrics');
        t.field('overallWritingMetric', { type: exports.OverallWritingMetric });
        t.field('howProblemSolutionMetrics', { type: exports.HowProblemSolutionMetrics });
        t.field('howCauseEffectMetrics', { type: exports.HowCauseEffectMetrics });
        t.field('whyCauseEffectMetrics', { type: exports.WhyCauseEffectMetrics });
        t.field('inCourse', { type: courses_1.Course });
    },
});
exports.WritingLevelEnum = schema_1.enumType({
    name: 'WritingLevelEnum',
    members: ['DEVELOPING', 'ACADEMIC', 'ADVANCED'],
});
exports.OverallWritingMetric = schema_1.objectType({
    name: 'OverallWritingMetric',
    definition(t) {
        t.int('levelPoints');
        t.field('overallWritingLevel', { type: exports.WritingLevelEnum });
    },
});
exports.HowProblemSolutionMetrics = schema_1.objectType({
    name: 'HowProblemSolutionMetrics',
    definition(t) {
        t.int('levelPoints');
        t.field('howProblemSolutionLevel', { type: exports.WritingLevelEnum });
    },
});
exports.HowCauseEffectMetrics = schema_1.objectType({
    name: 'HowCauseEffectMetrics',
    definition(t) {
        t.int('levelPoints');
        t.field('howCauseEffectLevel', { type: exports.WritingLevelEnum });
    },
});
exports.WhyCauseEffectMetrics = schema_1.objectType({
    name: 'WhyCauseEffectMetrics',
    definition(t) {
        t.int('levelPoints');
        t.field('whyCauseEffectLevel', { type: exports.WritingLevelEnum });
    },
});
//# sourceMappingURL=writingMetrics.js.map