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
exports.ReturnReadingGuide = exports.ReturnReadingGuidePayload = exports.ReturnReadingGuideInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.ReturnReadingGuideInput = schema_1.inputObjectType({
    name: 'ReturnReadingGuideInput',
    definition(t) {
        t.id('readingGuideId', { required: true });
        t.int('score', { required: true });
    },
});
exports.ReturnReadingGuidePayload = schema_1.objectType({
    name: 'ReturnReadingGuidePayload',
    definition(t) {
        t.field('readingGuide', { type: _1.ReadingGuide });
    },
});
exports.ReturnReadingGuide = schema_1.mutationField('returnReadingGuide', {
    type: exports.ReturnReadingGuidePayload,
    args: { input: schema_1.arg({ type: exports.ReturnReadingGuideInput, required: true }) },
    resolve(_, { input: { readingGuideId, score } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuideValidation = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(readingGuideId),
            });
            if (readingGuideValidation) {
                assignmentData.updateOne({
                    _id: new mongodb_1.ObjectId(readingGuideId),
                }, {
                    $set: {
                        'score.earnedPoints': score,
                        'readingGuideFinal.returned': true,
                        'readingGuideFinal.graded': true,
                    },
                });
                const readingGuide = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(readingGuideId),
                });
                return { readingGuide };
            }
            else
                throw new Error('Reading Guide does not exist.');
        });
    },
});
//# sourceMappingURL=returnReadingGuide.js.map