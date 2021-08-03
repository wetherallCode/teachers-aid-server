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
exports.SetOrganizer = exports.SetOrganizerPayload = exports.SetOrganizerInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const writingMetrics_1 = require("../../../students/progress-metrics/writingMetrics");
const mongodb_1 = require("mongodb");
exports.SetOrganizerInput = schema_1.inputObjectType({
    name: 'SetOrganizerInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.field('writingLevel', { type: writingMetrics_1.WritingLevelEnum, required: true });
    },
});
exports.SetOrganizerPayload = schema_1.objectType({
    name: 'SetOrganizerPayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.SetOrganizer = schema_1.mutationField('setOrganizer', {
    type: exports.SetOrganizerPayload,
    args: { input: schema_1.arg({ type: exports.SetOrganizerInput, required: true }) },
    resolve(_, { input: { essayId, writingLevel } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const organizerCheck = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(essayId),
            });
            if (!organizerCheck.workingDraft.organizer) {
                if (writingLevel === 'DEVELOPING') {
                    const developingOrganizer = {
                        developingSentenceStructure: {
                            subject: '',
                            verb: '',
                        },
                        restatement: '',
                        answer: '',
                        conclusion: '',
                    };
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: { 'workingDraft.organizer': developingOrganizer },
                    });
                    const essay = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(essayId),
                    });
                    return { essay };
                }
                if (writingLevel === 'ACADEMIC') {
                    const academicOrganizer = {
                        academicSentenceStructure: {
                            subject: '',
                            verb: '',
                            object: '',
                        },
                        restatement: '',
                        conclusion: '',
                    };
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: { 'workingDraft.organizer': academicOrganizer },
                    });
                    const essay = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(essayId),
                    });
                    return { essay };
                }
                if (writingLevel === 'ADVANCED') {
                    const advancedOrganizer = {
                        advancedSentenceStructure: {
                            subject: '',
                            verb: '',
                            object: '',
                        },
                        restatement: '',
                        conclusion: '',
                    };
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: { 'workingDraft.organizer': advancedOrganizer },
                    });
                    const essay = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(essayId),
                    });
                    return { essay };
                }
                else
                    throw new Error('You need an appropriate writing level');
            }
            else
                throw new Error('Organizer already added');
        });
    },
});
//# sourceMappingURL=setOrganizer.js.map