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
const mongodb_1 = require("mongodb");
exports.FindLessonByIdInput = schema_1.inputObjectType({
    name: 'FindLessonByIdInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.FindLessonByIdPayload = schema_1.objectType({
    name: 'FindLessonByIdPayload',
    definition(t) {
        t.field('lesson', { type: _1.Lesson });
    },
});
exports.FindLessonById = schema_1.queryField('findLessonById', {
    type: exports.FindLessonByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindLessonByIdInput, required: true }) },
    resolve(_, { input: { _id } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield lessonData.findOne({ _id: new mongodb_1.ObjectId(_id) });
            return { lesson };
        });
    },
});
//# sourceMappingURL=findLessonById.js.map