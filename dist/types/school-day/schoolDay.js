"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSignInSheet = exports.SchoolDay = void 0;
const schema_1 = require("@nexus/schema");
const schoolDayType_1 = require("./schoolDayType");
const students_1 = require("../students");
const __1 = require("..");
exports.SchoolDay = schema_1.objectType({
    name: 'SchoolDay',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('todaysDate');
        t.field('currentSchoolDayType', { type: schoolDayType_1.SchoolDayType });
        t.int('schoolDayCount');
        t.field('cohortWeek', { type: students_1.StudentCohortEnum });
        t.list.field('signInSheets', {
            type: exports.StudentSignInSheet,
            nullable: true,
        });
    },
});
exports.StudentSignInSheet = schema_1.objectType({
    name: 'StudentSignInSheet',
    definition(t) {
        t.field('course', { type: __1.Course });
        t.list.field('studentsSignInlog', {
            type: students_1.Student,
            nullable: true,
        });
        t.date('lessonDate');
    },
});
//# sourceMappingURL=schoolDay.js.map