"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentQuestion = exports.StudentQuestions = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("../..");
exports.StudentQuestions = schema_1.objectType({
    name: 'StudentQuestions',
    definition(t) {
        t.id('_id', { nullable: true });
        t.id('course');
        t.id('associatedSchoolDayId');
        t.string('date');
        t.list.field('questions', { type: exports.StudentQuestion });
    },
});
exports.StudentQuestion = schema_1.objectType({
    name: 'StudentQuestion',
    definition(t) {
        t.field('student', { type: __1.Student });
        t.string('timeAsked');
        t.string('question');
    },
});
//# sourceMappingURL=studentQuestion.js.map