"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmittedFinalDraftsInput = exports.SubmittedFinalDraft = exports.FinalDraftContainer = exports.WorkingDraft = exports.ReadingsInput = exports.TopicInput = exports.Topic = exports.Essay = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("../..");
const students_1 = require("../../students");
const organizers_1 = require("./organizers");
const rubrics_1 = require("./rubrics");
exports.Essay = schema_1.objectType({
    name: 'Essay',
    definition(t) {
        t.implements('Assignment');
        t.field('topic', { type: exports.Topic });
        t.field('workingDraft', { type: exports.WorkingDraft });
        t.field('finalDraft', { type: exports.FinalDraftContainer, nullable: true });
        t.boolean('leveledUp');
    },
});
exports.Topic = schema_1.objectType({
    name: 'Topic',
    definition(t) {
        t.field('questionType', { type: __1.QuestionTypeEnum });
        t.string('question');
        t.field('writingLevel', { type: students_1.WritingLevelEnum });
    },
});
exports.TopicInput = schema_1.inputObjectType({
    name: 'TopicInput',
    definition(t) {
        t.string('question', { required: true });
        t.field('questionType', { type: __1.QuestionTypeEnum, required: true });
        t.field('writingLevel', { type: students_1.WritingLevelEnum, required: true });
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
        t.field('organizer', { type: organizers_1.Organizers, nullable: true });
        t.string('draft');
    },
});
exports.FinalDraftContainer = schema_1.objectType({
    name: 'FinalDraftContainer',
    definition(t) {
        t.list.field('submittedFinalDraft', { type: exports.SubmittedFinalDraft });
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
        t.int('draftNumber');
        t.list.field('rubricEntries', { type: rubrics_1.RubricEntry });
        t.list.string('additionalComments', { nullable: true });
        t.float('score');
        t.boolean('graded');
    },
});
exports.SubmittedFinalDraftsInput = schema_1.inputObjectType({
    name: 'SubmittedFinalDraftsInput',
    definition(t) {
        t.JSON('draft', { required: true });
        t.JSON('gradingDraft', { required: true });
        t.int('draftNumber', { required: true });
        t.list.field('rubricEntries', { type: rubrics_1.RubricEntryInput, required: true });
        t.list.string('additionalComments');
        t.float('score', { required: true });
        t.boolean('graded', { required: true });
    },
});
//# sourceMappingURL=essays.js.map