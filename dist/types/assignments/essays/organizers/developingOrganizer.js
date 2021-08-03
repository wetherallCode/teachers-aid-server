"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopingOrganizerInput = exports.DevelopingSentenceStructureInput = exports.DevelopingSentenceStructure = exports.BasicQuestionEnum = exports.DevelopingOrganizer = void 0;
const schema_1 = require("@nexus/schema");
exports.DevelopingOrganizer = schema_1.objectType({
    name: 'DevelopingOrganizer',
    definition(t) {
        t.field('basicQuestionType', { type: exports.BasicQuestionEnum, nullable: true });
        t.field('developingSentenceStructure', {
            type: exports.DevelopingSentenceStructure,
        });
        t.string('restatement');
        t.string('answer');
        t.string('conclusion');
    },
});
exports.BasicQuestionEnum = schema_1.enumType({
    name: 'BasicQuestionEnum',
    members: ['HOW', 'WHY'],
});
exports.DevelopingSentenceStructure = schema_1.objectType({
    name: 'DevelopingSentenceStructure',
    definition(t) {
        t.string('subject');
        t.string('verb');
    },
});
exports.DevelopingSentenceStructureInput = schema_1.inputObjectType({
    name: 'DevelopingSentenceStructureInput',
    definition(t) {
        t.string('subject', { required: true });
        t.string('verb', { required: true });
    },
});
exports.DevelopingOrganizerInput = schema_1.inputObjectType({
    name: 'DevelopingOrganizerInput',
    definition(t) {
        t.string('questionType', { required: true });
        t.string('sentenceStructure', { required: true });
        t.string('restatement', { required: true });
        t.string('answer', { required: true });
        t.string('conclusion', { required: true });
    },
});
//# sourceMappingURL=developingOrganizer.js.map