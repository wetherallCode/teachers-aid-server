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
exports.FindCompletedEssaysByStudentId = exports.FindCompletedEssaysByStudentIdPayload = exports.FindCompletedEssaysByStudentIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindCompletedEssaysByStudentIdInput = schema_1.inputObjectType({
    name: 'FindCompletedEssaysByStudentIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindCompletedEssaysByStudentIdPayload = schema_1.objectType({
    name: 'FindCompletedEssaysByStudentIdPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.FindCompletedEssaysByStudentId = schema_1.queryField('findCompletedEssaysByStudentId', {
    type: exports.FindCompletedEssaysByStudentIdPayload,
    args: {
        input: schema_1.arg({ type: exports.FindCompletedEssaysByStudentIdInput, required: true }),
    },
    resolve(_, { input: { studentId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = yield assignmentData
                .find({
                'hasOwner._id': new mongodb_1.ObjectId(studentId),
                'finalDraft.returned': true,
            })
                .toArray();
            return { essays };
        });
    },
});
//# sourceMappingURL=findCompletedEssayByStudentId.js.map