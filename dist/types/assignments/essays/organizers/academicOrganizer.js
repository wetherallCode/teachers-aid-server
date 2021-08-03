"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSentenceStructureInput = exports.AcademicSentenceStructure = exports.AcademicOrganizer = void 0;
const schema_1 = require("@nexus/schema");
const answerTypes_1 = require("./answerTypes");
const textSection_1 = require("../../../textSections/textSection");
exports.AcademicOrganizer = schema_1.objectType({
    name: 'AcademicOrganizer',
    definition(t) {
        t.typeName;
        t.field('questionType', { type: textSection_1.QuestionTypeEnum, nullable: true });
        t.field('answerType', { type: answerTypes_1.AnswerTypes, nullable: true });
        t.field('academicSentenceStructure', { type: exports.AcademicSentenceStructure });
        t.string('restatement');
        t.string('conclusion');
    },
});
exports.AcademicSentenceStructure = schema_1.objectType({
    name: 'AcademicSentenceStructure',
    definition(t) {
        t.string('subject');
        t.string('verb');
        t.string('object', { nullable: true });
    },
});
exports.AcademicSentenceStructureInput = schema_1.inputObjectType({
    name: 'AcademicSentenceStructureInput',
    definition(t) {
        t.string('subject', { required: true });
        t.string('verb', { required: true });
        t.string('object');
    },
});
//# sourceMappingURL=academicOrganizer.js.map