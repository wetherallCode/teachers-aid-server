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
const students_1 = require("./students");
const mongodb_1 = require("mongodb");
exports.FindStudentsByIdInput = schema_1.inputObjectType({
    name: 'FindStudentsByIdInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
    },
});
exports.FindStudentsByIdPayload = schema_1.objectType({
    name: 'FindStudentsByIdPayload',
    definition(t) {
        t.list.field('students', { type: students_1.Student });
    },
});
exports.FindStudentsById = schema_1.queryField('findStudentsById', {
    type: exports.FindStudentsByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindStudentsByIdInput, required: true }) },
    resolve(_, { input: { studentIds } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(new Date().toISOString());
            const students = [];
            for (const _id of studentIds) {
                const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(_id) });
                students.push(student);
            }
            console.log(new Date().toISOString());
            return { students };
        });
    },
});
//# sourceMappingURL=findStudentsById.js.map