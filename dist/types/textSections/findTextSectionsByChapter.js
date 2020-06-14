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
const textSection_1 = require("./textSection");
const mongodb_1 = require("mongodb");
exports.FindTextSectionsByChapterInput = schema_1.inputObjectType({
    name: 'FindTextSectionsByChapterInput',
    definition(t) {
        t.id('fromChapterId', { required: true });
    },
});
exports.FindTextSectionsByChapterPayload = schema_1.objectType({
    name: 'FindTextSectionsByChapterPayload',
    definition(t) {
        t.list.field('textSections', { type: textSection_1.TextSection });
    },
});
exports.FindTextSectionsByChapter = schema_1.queryField('findTextSectionsByChapter', {
    type: exports.FindTextSectionsByChapterPayload,
    args: {
        input: schema_1.arg({ type: exports.FindTextSectionsByChapterInput, required: true }),
    },
    resolve(_, { input: { fromChapterId } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const textSections = yield textData
                .find({
                'fromChapter._id': new mongodb_1.ObjectId(fromChapterId),
            })
                .toArray();
            return { textSections };
        });
    },
});
//# sourceMappingURL=findTextSectionsByChapter.js.map