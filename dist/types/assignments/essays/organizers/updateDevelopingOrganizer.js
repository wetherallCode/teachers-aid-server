"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDevelopingOrganizer = exports.UpdateDevelopingOrganizerPayload = exports.UpdateDevelopingOrganizerInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.UpdateDevelopingOrganizerInput = schema_1.inputObjectType({
    name: 'UpdateDevelopingOrganizerInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.field('basicQuestionType', { type: __1.BasicQuestionEnum, required: true });
        t.field('developingSentenceStructure', {
            type: __1.DevelopingSentenceStructureInput,
            required: true,
        });
        t.string('restatement', { required: true });
        t.string('answer', { required: true });
        t.string('conclusion', { required: true });
    },
});
exports.UpdateDevelopingOrganizerPayload = schema_1.objectType({
    name: 'UpdateDevelopingOrganizerPayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.UpdateDevelopingOrganizer = schema_1.mutationField('updateDevelopingOrganizer', {
    type: exports.UpdateDevelopingOrganizerPayload,
    args: {
        input: schema_1.arg({ type: exports.UpdateDevelopingOrganizerInput, required: true }),
    },
    resolve(_, { input: { essayId, basicQuestionType, developingSentenceStructure, restatement, answer, conclusion, }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const organizerTypeCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
            if (organizerTypeCheck.workingDraft.organizer.hasOwnProperty('developingSentenceStructure')) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                    $set: {
                        'workingDraft.organizer.basicQuestionType': basicQuestionType,
                        'workingDraft.organizer.developingSentenceStructure': developingSentenceStructure,
                        'workingDraft.organizer.restatement': restatement,
                        'workingDraft.organizer.answer': answer,
                        'workingDraft.organizer.conclusion': conclusion,
                    },
                });
                const essay = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(essayId),
                });
                return { essay };
            }
            else
                throw new Error('This is not the correct organizer');
        });
    },
});
//# sourceMappingURL=updateDevelopingOrganizer.js.map