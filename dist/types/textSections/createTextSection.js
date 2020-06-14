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
const _1 = require(".");
const textSection_1 = require("./textSection");
const mongodb_1 = require("mongodb");
exports.CreateTextSectionInput = schema_1.inputObjectType({
    name: 'CreateTextSectionInput',
    definition(t) {
        t.string('fromChapterId', { required: true });
        t.field('pageNumbers', { type: textSection_1.PageNumbersInput, required: true });
        t.string('header', { required: true });
        t.list.field('hasProtocols', {
            type: _1.TextSectionProtocolsInput,
            required: true,
        });
        t.list.field('hasVocab', { type: textSection_1.TextSectionVocabInput, required: true });
        t.list.field('hasQuestions', {
            type: _1.TextSectionQuestionsInput,
            required: true,
        });
    },
});
exports.CreateTextSectionPayload = schema_1.objectType({
    name: 'CreateTextSectionPayload',
    definition(t) {
        t.field('textSection', { type: textSection_1.TextSection });
    },
});
exports.CreateTextSection = schema_1.mutationField('createTextSection', {
    type: exports.CreateTextSectionPayload,
    args: { input: schema_1.arg({ type: exports.CreateTextSectionInput, required: true }) },
    resolve(_, { input: { fromChapterId, pageNumbers, header, hasProtocols, hasVocab, hasQuestions, }, }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapter = yield textData.findOne({ _id: new mongodb_1.ObjectId(fromChapterId) });
            const newTextSection = {
                fromChapter: chapter,
                pageNumbers,
                header,
                hasProtocols,
                hasVocab,
                hasQuestions,
            };
            const { insertedId } = yield textData.insertOne(newTextSection);
            newTextSection._id = insertedId;
            return { textSection: newTextSection };
        });
    },
});
//# sourceMappingURL=createTextSection.js.map