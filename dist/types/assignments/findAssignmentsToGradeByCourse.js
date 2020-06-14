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
exports.FindAssignmentsToGradeByCourseInput = schema_1.inputObjectType({
    name: 'FindAssignmentsToGradeInput',
    definition(t) {
        t.string('teacherUserName', { required: true });
        t.string('courseName', { required: true });
    },
});
exports.FindAssignmentsToGradeByCoursePayload = schema_1.objectType({
    name: 'FindAssignmentsToGradePayload',
    definition(t) {
        t.list.field('assignments', { type: _1.Assignment });
    },
});
exports.FindAssignmentsToGradeByCourse = schema_1.queryField('findAssignmentsToGradeByCourse', {
    type: exports.FindAssignmentsToGradeByCoursePayload,
    args: {
        input: schema_1.arg({ type: exports.FindAssignmentsToGradeByCourseInput, required: true }),
    },
    resolve(_, { input: { teacherUserName, courseName } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignments = yield assignmentData
                .find({ hasTeacher: teacherUserName, courseName })
                .toArray();
            return { assignments };
        });
    },
});
//# sourceMappingURL=findAssignmentsToGradeByCourse.js.map