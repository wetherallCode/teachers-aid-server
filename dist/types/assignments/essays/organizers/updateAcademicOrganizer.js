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
exports.UpdateAcademicOrganizer = exports.UpdateAcademicOrganizerPayload = exports.UpdateAcademicOrganizerInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.UpdateAcademicOrganizerInput = schema_1.inputObjectType({
    name: 'UpdateAcademicOrganizerInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.field('academicSentenceStructure', {
            type: __1.AcademicSentenceStructureInput,
            required: true,
        });
        t.string('restatement', { required: true });
        t.string('conclusion', { required: true });
    },
});
exports.UpdateAcademicOrganizerPayload = schema_1.objectType({
    name: 'UpdateAcademicOrganizerPayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.UpdateAcademicOrganizer = schema_1.mutationField('updateAcademicOrganizer', {
    type: exports.UpdateAcademicOrganizerPayload,
    args: {
        input: schema_1.arg({ type: exports.UpdateAcademicOrganizerInput, required: true }),
    },
    resolve(_, { input: { essayId, academicSentenceStructure, restatement, conclusion }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const organizerTypeCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
            if (organizerTypeCheck.workingDraft.organizer.hasOwnProperty('academicSentenceStructure')) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                    $set: {
                        'workingDraft.organizer.academicSentenceStructure': academicSentenceStructure,
                        'workingDraft.organizer.restatement': restatement,
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
//# sourceMappingURL=updateAcademicOrganizer.js.map