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
exports.AddNewChapterInput = schema_1.inputObjectType({
    name: 'AddNewChapterInput',
    definition(t) {
        t.string('textTitle', { required: true });
        t.int('chapterNumber', { required: true });
        t.string('chapterTitle', { required: true });
    },
});
exports.AddNewChapterPayload = schema_1.objectType({
    name: 'AddNewChapterPayload',
    definition(t) {
        t.field('chapter', { type: _1.Chapter });
    },
});
exports.AddNewChapter = schema_1.mutationField('addNewChapter', {
    type: exports.AddNewChapterPayload,
    args: { input: schema_1.arg({ type: exports.AddNewChapterInput, required: true }) },
    resolve(_, { input: { textTitle, chapterTitle, chapterNumber } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromText = yield textData.findOne({ textTitle });
            const newChapter = {
                chapterNumber,
                chapterTitle,
                fromText,
            };
            const { insertedId } = yield textData.insertOne(newChapter);
            newChapter._id = insertedId;
            return { chapter: newChapter };
        });
    },
});
//# sourceMappingURL=addNewChapter.js.map