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
exports.StartReadingGuide = exports.StartReadingGuidePayload = exports.StartReadingGuideInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.StartReadingGuideInput = schema_1.inputObjectType({
    name: 'StartReadingGuideInput',
    definition(t) {
        t.id('readingGuideId', { required: true });
        t.boolean('paperBased', { required: true });
    },
});
exports.StartReadingGuidePayload = schema_1.objectType({
    name: 'StartReadingGuidePayload',
    definition(t) {
        t.field('readingGuide', { type: _1.ReadingGuide });
    },
});
exports.StartReadingGuide = schema_1.mutationField('startReadingGuide', {
    type: exports.StartReadingGuidePayload,
    args: { input: schema_1.arg({ type: exports.StartReadingGuideInput, required: true }) },
    resolve(_, { input: { readingGuideId, paperBased } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuideValidation = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(readingGuideId),
            });
            if (readingGuideValidation) {
                if (!readingGuideValidation.readingGuideFinal) {
                    if (paperBased) {
                        assignmentData.updateOne({
                            _id: new mongodb_1.ObjectId(readingGuideId),
                        }, {
                            $set: {
                                assigned: false,
                                paperBased,
                            },
                        });
                    }
                    if (!paperBased) {
                        assignmentData.updateOne({
                            _id: new mongodb_1.ObjectId(readingGuideId),
                        }, {
                            $set: {
                                readingGuideFinal: {
                                    howIsSectionOrganized: [],
                                    whyWasSectionOrganized: '',
                                    majorIssue: '',
                                    majorIssueSolved: true,
                                    majorSolution: '',
                                    clarifyingQuestions: [],
                                    submitted: false,
                                    submitTime: '',
                                },
                            },
                        });
                    }
                    const readingGuide = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(readingGuideId),
                    });
                    return { readingGuide };
                }
                else
                    throw new Error('Already started');
            }
            else
                throw new Error('Reading Guide does not exist.');
        });
    },
});
//# sourceMappingURL=startReadingGuide.js.map