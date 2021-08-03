"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicOutcomeTypes = exports.ProtocolActivityTypes = exports.TextSectionProtocolsInput = exports.TextSectionProtocols = void 0;
const schema_1 = require("@nexus/schema");
exports.TextSectionProtocols = schema_1.objectType({
    name: 'TextSectionProtocols',
    description: 'Protocol suggestions for including in a LessonPlan',
    definition(t) {
        t.field('activityType', { type: exports.ProtocolActivityTypes });
        t.field('academicOutcomeTypes', { type: exports.AcademicOutcomeTypes });
        t.string('task');
        t.boolean('completed');
        t.boolean('isActive');
    },
});
exports.TextSectionProtocolsInput = schema_1.inputObjectType({
    name: 'TextSectionProtocolsInput',
    definition(t) {
        t.field('activityType', {
            type: exports.ProtocolActivityTypes,
            required: true,
        });
        t.field('academicOutcomeTypes', {
            type: exports.AcademicOutcomeTypes,
            required: true,
        });
        t.string('task', { required: true });
        t.boolean('isActive', { required: true });
        t.boolean('completed', { required: true });
    },
});
exports.ProtocolActivityTypes = schema_1.enumType({
    name: 'ProtocolActivityTypes',
    members: ['THINK_PAIR_SHARE', 'INDIVIDUAL', 'SMALL_GROUP'],
});
exports.AcademicOutcomeTypes = schema_1.enumType({
    name: 'AcademicOutcomeTypes',
    members: [
        'SCHEMA_BUIDING',
        'LOGIC_BUILDING',
        'SOCRATIC_QUESTIONS',
        'CAUSE_AND_EFFECT_RECOGNITION',
    ],
});
//# sourceMappingURL=textSectionProtocols.js.map