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
exports.FindTemporaryTasksByStudentId = exports.FindTemporaryTasksByStudentIdPayload = exports.FindTemporaryTasksByStudentIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindTemporaryTasksByStudentIdInput = schema_1.inputObjectType({
    name: 'FindTemporaryTasksByStudentIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindTemporaryTasksByStudentIdPayload = schema_1.objectType({
    name: 'FindTemporaryTasksByStudentIdPayload',
    definition(t) {
        t.list.field('temporaryTasks', { type: _1.TemporaryTask });
    },
});
exports.FindTemporaryTasksByStudentId = schema_1.queryField('findTemporaryTasksByStudentId', {
    type: exports.FindTemporaryTasksByStudentIdPayload,
    args: {
        input: schema_1.arg({ type: exports.FindTemporaryTasksByStudentIdInput, required: true }),
    },
    resolve(_, { input: { studentId } }, { temporaryTaskData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryTasks = yield temporaryTaskData
                .find({ 'student._id': new mongodb_1.ObjectId(studentId) })
                .toArray();
            return { temporaryTasks };
        });
    },
});
//# sourceMappingURL=findTemporaryTasksByStudentId.js.map