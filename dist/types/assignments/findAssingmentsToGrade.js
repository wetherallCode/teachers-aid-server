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
exports.FindAssignmentsToGradeInput = schema_1.inputObjectType({
    name: 'FindAssignmentsToGradeInput',
    definition(t) {
        t.string('teacherUserName', { required: true });
    },
});
exports.FindAssignmentsToGradePayload = schema_1.objectType({
    name: 'FindAssignmentsToGradePayload',
    definition(t) {
        t.list.field('assignments', { type: _1.Assignment });
    },
});
exports.FindAssignmentsToGrade = schema_1.queryField('findAssignmentsToGrade', {
    type: exports.FindAssignmentsToGradePayload,
    args: { input: schema_1.arg({ type: exports.FindAssignmentsToGradeInput, required: true }) },
    resolve(_, { input: { teacherUserName } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignments = yield assignmentData
                .find({
                'hasAssigner.userName': teacherUserName,
                'finalDraft.submitted': true,
            })
                .toArray();
            return { assignments: assignments };
        });
    },
});
//# sourceMappingURL=findAssingmentsToGrade.js.map