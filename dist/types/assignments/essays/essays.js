"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const __1 = require("../..");
const students_1 = require("../../students");
exports.Essay = schema_1.objectType({
    name: 'Essay',
    definition(t) {
        t.implements('Assignment');
        t.field('topic', { type: exports.Topic });
        t.field('workingDraft', { type: exports.WorkingDraft });
        t.field('finalDraft', { type: exports.FinalDraftContainer, nullable: true });
    },
});
exports.Topic = schema_1.objectType({
    name: 'Topic',
    definition(t) {
        t.field('questionType', { type: __1.QuestionTypeEnum });
        t.string('question');
        t.field('writingLevel', { type: students_1.WritingLevelType });
    },
});
exports.TopicInput = schema_1.inputObjectType({
    name: 'TopicInput',
    definition(t) {
        t.string('question', { required: true });
        t.field('questionType', { type: __1.QuestionTypeEnum, required: true });
        t.field('writingLevel', { type: students_1.WritingLevelType, required: true });
    },
});
exports.ReadingsInput = schema_1.inputObjectType({
    name: 'ReadingsInput',
    definition(t) {
        t.string('readingPages', { required: true });
        t.string('readingSections', { required: true });
    },
});
exports.WorkingDraft = schema_1.objectType({
    name: 'WorkingDraft',
    definition(t) {
        t.JSON('draft');
    },
});
exports.FinalDraftContainer = schema_1.objectType({
    name: 'FinalDraftContainer',
    definition(t) {
        t.field('submittedFinalDraft', { type: exports.SubmittedFinalDraft });
        t.boolean('submitted');
        t.boolean('returned');
        t.dateTime('submitTime', { nullable: true });
    },
});
exports.SubmittedFinalDraft = schema_1.objectType({
    name: 'SubmittedFinalDraft',
    definition(t) {
        t.JSON('draft');
        t.JSON('gradingDraft');
        t.list.string('comments');
        t.int('score');
    },
});
exports.SubmittedFinalDraftsInput = schema_1.inputObjectType({
    name: 'SubmittedFinalDraftsInput',
    definition(t) {
        t.JSON('draft', { required: true });
        t.JSON('gradingDraft', { required: true });
        t.list.string('comments', { required: true });
        t.int('score', { required: true });
    },
});
//# sourceMappingURL=essays.js.map