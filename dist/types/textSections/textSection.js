"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const texts_1 = require("../texts");
exports.TextSection = schema_1.objectType({
    name: 'TextSection',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('fromChapter', { type: texts_1.Chapter });
        t.field('pageNumbers', { type: exports.PageNumbers });
        t.string('header');
        t.list.field('hasProtocols', { type: exports.TextSectionProtocols });
        t.list.field('hasVocab', { type: exports.TextSectionVocab });
        t.list.field('hasQuestions', { type: exports.TextSectionQuestions });
    },
});
exports.PageNumbers = schema_1.objectType({
    name: 'PageNumbers',
    definition(t) {
        t.int('startingPage');
        t.int('endingPage');
    },
});
exports.PageNumbersInput = schema_1.inputObjectType({
    name: 'PageNumbersInput',
    definition(t) {
        t.int('startingPage', { required: true });
        t.int('endingPage', { required: true });
    },
});
exports.TextSectionVocab = schema_1.objectType({
    name: 'TextSectionVocab',
    definition(t) {
        t.string('word');
        t.string('definition');
    },
});
exports.TextSectionVocabInput = schema_1.inputObjectType({
    name: 'TextSectionVocabInput',
    definition(t) {
        t.string('word', { required: true });
        t.string('definition', { required: true });
    },
});
exports.TextSectionProtocols = schema_1.objectType({
    name: 'TextSectionProtocols',
    description: 'Protocol suggestions for including in a LessonPlan',
    definition(t) {
        t.field('activityType', { type: exports.ProtocolActivityTypes });
        t.field('academicOutcomeTypes', { type: exports.AcademicOutcomeTypes });
        t.string('task');
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
    },
});
exports.ProtocolActivityTypes = schema_1.enumType({
    name: 'ProtocolActivityTypes',
    members: ['THINK_PAIR_SHARE', 'INDIVIDUAL'],
});
exports.AcademicOutcomeTypes = schema_1.enumType({
    name: 'AcademicOutomeTypes',
    members: ['SCHEMA_BUIDING', 'LOGIC_BUILDING', 'SOCRATIC_QUESTIONS'],
});
exports.QuestionTypeEnum = schema_1.enumType({
    name: 'QuestionTypeEnum',
    members: ['HOW_PROBLEM_SOLUTION', 'WHY_CAUSE_EFFECT', 'HOW_CAUSE_EFFECT'],
});
exports.TextSectionQuestions = schema_1.objectType({
    name: 'TextSectionQuestions',
    definition(t) {
        t.string('question');
        t.field('questionType', { type: exports.QuestionTypeEnum });
    },
});
exports.TextSectionQuestionsInput = schema_1.inputObjectType({
    name: 'TextSectionQuestionsInput',
    definition(t) {
        t.string('question', { required: true });
        t.field('questionType', { type: exports.QuestionTypeEnum, required: true });
    },
});
//# sourceMappingURL=textSection.js.map