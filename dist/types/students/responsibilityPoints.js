"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const general_1 = require("../general");
const students_1 = require("./students");
exports.ResponsibilityPoints = schema_1.objectType({
    name: 'ResponsibilityPoints',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: students_1.Student });
        t.int('responsibilityPoints');
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
    },
});
//# sourceMappingURL=responsibilityPoints.js.map