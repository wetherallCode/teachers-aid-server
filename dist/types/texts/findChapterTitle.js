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
exports.FindChapterTitle = exports.FindChapterTitlePayload = exports.FindChapterTitleInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindChapterTitleInput = schema_1.inputObjectType({
    name: 'FindChapterTitleInput',
    definition(t) {
        t.id('chapter_id', { required: true });
    },
});
exports.FindChapterTitlePayload = schema_1.objectType({
    name: 'FindChapterTitlePayload',
    definition(t) {
        t.field('chapter', { type: _1.Chapter });
    },
});
exports.FindChapterTitle = schema_1.queryField('findChapterTitle', {
    type: exports.FindChapterTitlePayload,
    args: { input: schema_1.arg({ type: exports.FindChapterTitleInput, required: true }) },
    resolve(_, { input: { chapter_id } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapter = yield textData.findOne({ _id: new mongodb_1.ObjectID(chapter_id) });
            return { chapter };
        });
    },
});
//# sourceMappingURL=findChapterTitle.js.map