"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSentenceStructureInput = exports.AdvancedSentenceStructure = exports.AdvancedOrganizer = void 0;
const schema_1 = require("@nexus/schema");
const answerTypes_1 = require("./answerTypes");
const textSection_1 = require("../../../textSections/textSection");
exports.AdvancedOrganizer = schema_1.objectType({
    name: 'AdvancedOrganizer',
    definition(t) {
        t.typeName;
        t.field('questionType', { type: textSection_1.QuestionTypeEnum, nullable: true });
        t.field('answerType', { type: answerTypes_1.AnswerTypes, nullable: true });
        t.field('advancedSentenceStructure', { type: exports.AdvancedSentenceStructure });
        t.string('restatement');
        t.string('conclusion');
    },
});
exports.AdvancedSentenceStructure = schema_1.objectType({
    name: 'AdvancedSentenceStructure',
    definition(t) {
        t.string('subject');
        t.string('verb');
        t.string('object', { nullable: true });
    },
});
exports.AdvancedSentenceStructureInput = schema_1.inputObjectType({
    name: 'AdvancedSentenceStructureInput',
    definition(t) {
        t.string('subject', { required: true });
        t.string('verb', { required: true });
        t.string('object');
    },
});
//# sourceMappingURL=advancedOrganizer.js.map