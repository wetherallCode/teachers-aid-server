"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const __1 = require("..");
exports.UnexcusedLateness = schema_1.objectType({
    name: 'UnexcusedLateness',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: __1.Student });
        t.date('dayLate');
        t.field('markingPeriod', { type: __1.MarkingPeriodEnum });
    },
});
//# sourceMappingURL=unexcusedLateness.js.map