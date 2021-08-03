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
exports.FindReadingGuideById = exports.FindReadingGuideByIdPayload = exports.FindReadingGuideByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindReadingGuideByIdInput = schema_1.inputObjectType({
    name: 'FindReadingGuideByIdInput',
    definition(t) {
        t.id('readingGuideId', { required: true });
    },
});
exports.FindReadingGuideByIdPayload = schema_1.objectType({
    name: 'FindReadingGuideByIdPayload',
    definition(t) {
        t.field('readingGuide', { type: _1.ReadingGuide });
    },
});
exports.FindReadingGuideById = schema_1.queryField('findReadingGuideById', {
    type: exports.FindReadingGuideByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindReadingGuideByIdInput, required: true }) },
    resolve(_, { input: { readingGuideId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuide = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(readingGuideId),
            });
            return { readingGuide };
        });
    },
});
//# sourceMappingURL=findReadingGuideById.js.map