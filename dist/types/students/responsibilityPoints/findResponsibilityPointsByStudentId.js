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
exports.FindResponsibilityPointsByStudentId = exports.FindResponsibilityPointsByStudentIdPayload = exports.FindResponsibilityPointsByStudentIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindResponsibilityPointsByStudentIdInput = schema_1.inputObjectType({
    name: 'FindResponsibilityPointsByStudentIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindResponsibilityPointsByStudentIdPayload = schema_1.objectType({
    name: 'FindResponsibilityPointsByStudentIdPayload',
    definition(t) {
        t.list.field('responsibilityPoints', { type: _1.ResponsibilityPoints });
    },
});
exports.FindResponsibilityPointsByStudentId = schema_1.queryField('findResponsibilityPointsByStudentId', {
    type: exports.FindResponsibilityPointsByStudentIdPayload,
    args: {
        input: schema_1.arg({
            type: exports.FindResponsibilityPointsByStudentIdInput,
            required: true,
        }),
    },
    resolve(_, { input: { studentId } }, { studentData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentCheck = yield userData.findOne({
                _id: new mongodb_1.ObjectId(studentId),
            });
            if (!studentCheck) {
                throw new Error('Student does not exist');
            }
            const responsibilityPoints = yield studentData
                .find({
                'student._id': new mongodb_1.ObjectId(studentId),
                responsibilityPoints: { $exists: true },
            })
                .toArray();
            if (responsibilityPoints) {
                return { responsibilityPoints };
            }
            else
                throw new Error('responsibilityPoints do not exist');
        });
    },
});
//# sourceMappingURL=findResponsibilityPointsByStudentId.js.map