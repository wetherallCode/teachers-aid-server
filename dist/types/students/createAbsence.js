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
exports.CreateAbsence = exports.CreateAbsencePayload = exports.CreateAbsenceInput = void 0;
const schema_1 = require("@nexus/schema");
const studentAbsence_1 = require("./studentAbsence");
const general_1 = require("../general");
const mongodb_1 = require("mongodb");
exports.CreateAbsenceInput = schema_1.inputObjectType({
    name: 'CreateAbsenceInput',
    definition(t) {
        t.string('studentId', { required: true });
        t.date('dayAbsent', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.CreateAbsencePayload = schema_1.objectType({
    name: 'CreateAbsencePayload',
    definition(t) {
        t.field('studentAbsence', { type: studentAbsence_1.StudentAbsence });
    },
});
exports.CreateAbsence = schema_1.mutationField('createAbsence', {
    type: exports.CreateAbsencePayload,
    args: { input: schema_1.arg({ type: exports.CreateAbsenceInput, required: true }) },
    resolve(_, { input: { studentId, dayAbsent, markingPeriod } }, { studentData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield userData.findOne({
                _id: new mongodb_1.ObjectId(studentId),
            });
            const studentAbsences = yield studentData
                .find({
                'student._id': new mongodb_1.ObjectId(student._id),
                dayAbsent: { $exists: true },
            })
                .toArray();
            const absenceSearch = studentAbsences.some((absence) => absence.dayAbsent === dayAbsent);
            if (!absenceSearch) {
                const studentAbsence = {
                    student,
                    dayAbsent,
                    markingPeriod,
                };
                const { insertedId } = yield studentData.insertOne(studentAbsence);
                studentAbsence._id = insertedId;
                return { studentAbsence };
            }
            else
                throw new Error(student.userName + ' already has absence assigned for ' + dayAbsent);
        });
    },
});
//# sourceMappingURL=createAbsence.js.map