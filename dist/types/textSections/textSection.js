"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSectionQuestionsInput = exports.TextSectionQuestions = exports.QuestionTypeEnum = exports.TextSectionVocabInput = exports.TextSectionVocab = exports.PageNumbersInput = exports.PageNumbers = exports.TextSection = void 0;
const schema_1 = require("@nexus/schema");
const texts_1 = require("../texts");
const _1 = require(".");
exports.TextSection = schema_1.objectType({
    name: 'TextSection',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('fromChapter', { type: texts_1.Chapter });
        t.field('pageNumbers', { type: exports.PageNumbers });
        t.string('header');
        t.list.field('hasProtocols', { type: _1.TextSectionProtocols, nullable: true });
        t.list.field('hasVocab', { type: exports.TextSectionVocab, nullable: true });
        t.list.field('hasQuestions', { type: exports.TextSectionQuestions, nullable: true });
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
exports.QuestionTypeEnum = schema_1.enumType({
    name: 'QuestionTypeEnum',
    members: ['HOW_PROBLEM_SOLUTION', 'HOW_CAUSE_EFFECT', 'WHY_CAUSE_EFFECT'],
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