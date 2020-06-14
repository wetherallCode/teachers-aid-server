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
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.UpdateTextSectionInput = schema_1.inputObjectType({
    name: 'UpdateTextSectionInput',
    definition(t) {
        t.id('_id', { required: true });
        t.string('fromChapterId', { required: true });
        t.field('pageNumbers', { type: _1.PageNumbersInput, required: true });
        t.string('header', { required: true });
        t.list.field('hasProtocols', {
            type: _1.TextSectionProtocolsInput,
            required: true,
        });
        t.list.field('hasVocab', { type: _1.TextSectionVocabInput, required: true });
        t.list.field('hasQuestions', {
            type: _1.TextSectionQuestionsInput,
            required: true,
        });
    },
});
exports.UpdateTextSectionPayload = schema_1.objectType({
    name: 'UpdateTextSectionPayload',
    definition(t) {
        t.field('textSection', { type: _1.TextSection });
    },
});
exports.UpdateTextSection = schema_1.mutationField('updateTextSection', {
    type: exports.UpdateTextSectionPayload,
    args: { input: schema_1.arg({ type: exports.UpdateTextSectionInput, required: true }) },
    resolve(_, { input: { fromChapterId, _id, pageNumbers, header, hasProtocols, hasQuestions, hasVocab, }, }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapter = yield textData.findOne({ _id: new mongodb_1.ObjectId(fromChapterId) });
            yield textData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                $set: {
                    fromChapter: chapter,
                    pageNumbers: pageNumbers,
                    header: header,
                    hasProtocols: hasProtocols,
                    hasQuestions: hasQuestions,
                    hasVocab: hasVocab,
                },
            });
            const textSection = yield textData.findOne({ _id: new mongodb_1.ObjectId(_id) });
            return { textSection };
        });
    },
});
//# sourceMappingURL=updateTextSection.js.map