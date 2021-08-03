"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSeatInput = exports.StudentSeat = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
exports.StudentSeat = schema_1.objectType({
    name: 'StudentSeat',
    definition(t) {
        t.int('deskNumber');
        t.field('student', { type: __1.Student, nullable: true });
        t.field('redCohortStudent', { type: __1.Student, nullable: true });
        t.field('whiteCohortStudent', { type: __1.Student, nullable: true });
    },
});
exports.StudentSeatInput = schema_1.inputObjectType({
    name: 'StudentSeatInput',
    definition(t) {
        t.int('deskNumber', { required: true });
        t.id('studentId');
        t.id('redCohortStudentId');
        t.id('whiteCohortStudentId');
    },
});
//# sourceMappingURL=studentSeat.js.map