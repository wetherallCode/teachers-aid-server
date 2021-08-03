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
exports.FindStudentById = exports.FindStudentByIdPayload = exports.FindStudentByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindStudentByIdInput = schema_1.inputObjectType({
    name: 'FindStudentByIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindStudentByIdPayload = schema_1.objectType({
    name: 'FindStudentByIdPayload',
    definition(t) {
        t.field('student', { type: _1.Student });
    },
});
exports.FindStudentById = schema_1.queryField('findStudentById', {
    type: exports.FindStudentByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindStudentByIdInput, required: true }) },
    resolve(_, { input: { studentId } }, { userData, protocolData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield userData.findOne({
                _id: new mongodb_1.ObjectId(studentId),
                inCourses: { $exists: true },
            });
            const studentInfo = yield protocolData.findOne({
                'student._id': new mongodb_1.ObjectId(student._id),
            });
            return { student };
        });
    },
});
//# sourceMappingURL=findStudentById.js.map