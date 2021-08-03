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
exports.FindAllStudents = exports.FindAllStudentsPayload = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindAllStudentsPayload = schema_1.objectType({
    name: 'FindAllStudentsPayload',
    definition(t) {
        t.list.field('students', { type: _1.Student });
    },
});
exports.FindAllStudents = schema_1.queryField('findAllStudents', {
    type: exports.FindAllStudentsPayload,
    resolve(_, __, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                students: yield userData.find({ inCourses: { $exists: true } }).toArray(),
            };
        });
    },
});
//# sourceMappingURL=findAllStudents.js.map