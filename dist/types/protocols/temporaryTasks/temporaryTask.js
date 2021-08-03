"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporaryTask = void 0;
const schema_1 = require("@nexus/schema");
const general_1 = require("../../general");
const students_1 = require("../../students");
exports.TemporaryTask = schema_1.objectType({
    name: 'TemporaryTask',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('dateIssued');
        t.boolean('answered');
        t.field('student', { type: students_1.Student });
        t.int('taskNumber');
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
        t.boolean('studentPresent');
        t.float('lastGrade');
    },
});
//# sourceMappingURL=temporaryTask.js.map