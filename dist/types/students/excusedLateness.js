"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcusedLateness = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const general_1 = require("../general");
exports.ExcusedLateness = schema_1.objectType({
    name: 'ExcusedLateness',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: __1.Student });
        t.date('dayLateExcused');
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
    },
});
//# sourceMappingURL=excusedLateness.js.map