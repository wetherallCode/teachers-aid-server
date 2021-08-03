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
exports.FindEssaysToGradeById = exports.FindEssaysToGradeByIdPayload = exports.FindEssaysToGradeByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindEssaysToGradeByIdInput = schema_1.inputObjectType({
    name: 'FindEssaysToGradeByIdInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.FindEssaysToGradeByIdPayload = schema_1.objectType({
    name: 'FindEssaysToGradeByIdPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.FindEssaysToGradeById = schema_1.queryField('findEssaysToGradeById', {
    type: exports.FindEssaysToGradeByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindEssaysToGradeByIdInput, required: true }) },
    resolve(_, { input: { teacherId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = yield assignmentData
                .find({
                'hasAssigner._id': new mongodb_1.ObjectId(teacherId),
                finalDraft: { $exists: true },
                workingDraft: { $exists: true },
            })
                .toArray();
            return { essays };
        });
    },
});
//# sourceMappingURL=findEssaysToGradeByCourseId.js.map