"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolAssessmentEnum = exports.DiscussionTypesEnum = exports.Protocol = void 0;
const schema_1 = require("@nexus/schema");
const general_1 = require("../general");
const textSections_1 = require("../textSections");
const __1 = require("..");
exports.Protocol = schema_1.objectType({
    name: 'Protocol',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: __1.Student });
        t.list.field('partners', { type: __1.Student, nullable: true });
        t.field('discussionLevel', { type: exports.DiscussionTypesEnum, nullable: true });
        t.boolean('isActive');
        t.field('assessment', { type: exports.ProtocolAssessmentEnum, nullable: true });
        t.boolean('completed');
        t.field('protocolActivityType', { type: textSections_1.ProtocolActivityTypes });
        t.field('academicOutcomeType', { type: textSections_1.AcademicOutcomeTypes });
        t.string('task');
        t.string('assignedDate');
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
        t.string('startTime');
        t.string('endTime', { nullable: true });
        t.string('response', { nullable: true });
    },
});
exports.DiscussionTypesEnum = schema_1.enumType({
    name: 'DiscussionTypesEnum',
    members: [
        'NOT_REQUIRED',
        'SOME_DISCUSSION',
        'DISCUSSED',
        'THOROUGHLY_DISCUSSED',
    ],
});
exports.ProtocolAssessmentEnum = schema_1.enumType({
    name: 'ProtocolAssessmentEnum',
    members: [
        'REFUSED_TO_WORK',
        'SLOW_TO_GET_STARTED',
        'WORKED_POORLY',
        'WORKED_WELL',
        'WORKED_VERY_WELL',
    ],
});
//# sourceMappingURL=protocol.js.map