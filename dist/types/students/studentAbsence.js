"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const general_1 = require("../general");
const _1 = require(".");
exports.StudentAbsence = schema_1.objectType({
    name: 'StudentAbsence',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: _1.Student });
        t.date('dayAbsent');
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
    },
});
//# sourceMappingURL=studentAbsence.js.map