"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsibilityPoints = void 0;
const schema_1 = require("@nexus/schema");
const general_1 = require("../../general");
const student_1 = require("../student");
const courses_1 = require("../../courses");
exports.ResponsibilityPoints = schema_1.objectType({
    name: 'ResponsibilityPoints',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: student_1.Student });
        t.float('responsibilityPoints');
        t.field('inCourse', { type: courses_1.Course });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
    },
});
//# sourceMappingURL=responsibilityPoints.js.map