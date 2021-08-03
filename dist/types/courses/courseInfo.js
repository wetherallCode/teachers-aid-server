"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseInfo = void 0;
const schema_1 = require("@nexus/schema");
const schoolDayType_1 = require("../school-day/schoolDayType");
const _1 = require(".");
const __1 = require("..");
exports.CourseInfo = schema_1.objectType({
    name: 'CourseInfo',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('course', { type: _1.Course });
        t.id('associatedCourseId', { nullable: true });
        t.string('startsAt');
        t.string('endsAt');
        t.string('halfDayStartsAt');
        t.string('halfDayEndsAt');
        t.boolean('cohortBasedSeating');
        t.field('hasTeacher', { type: __1.Teacher });
        t.field('courseType', { type: _1.CourseTypeEnum });
        t.field('schoolDayType', { type: schoolDayType_1.SchoolDayType });
        t.list.field('assignedSeats', { type: _1.StudentSeat });
    },
});
//# sourceMappingURL=courseInfo.js.map