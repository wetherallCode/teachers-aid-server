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
const general_1 = require("../general");
const mongodb_1 = require("mongodb");
const excusedLateness_1 = require("./excusedLateness");
exports.CreateExcusedLatenessInput = schema_1.inputObjectType({
    name: 'CreateExcusedLatenessInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.date('dayLateExcused', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.CreateExcusedLatenessPayload = schema_1.objectType({
    name: 'CreateExcusedLatenessPayload',
    definition(t) {
        t.field('excusedLateness', { type: excusedLateness_1.ExcusedLateness });
    },
});
exports.CreateExcusedLateness = schema_1.mutationField('createExcusedLateness', {
    type: exports.CreateExcusedLatenessPayload,
    args: {
        input: schema_1.arg({ type: exports.CreateExcusedLatenessInput, required: true }),
    },
    resolve(_, { input: { studentId, dayLateExcused, markingPeriod } }, { userData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield userData.findOne({
                _id: new mongodb_1.ObjectId(studentId),
            });
            const studentLatenesses = yield studentData
                .find({
                'student._id': new mongodb_1.ObjectId(student._id),
                dayLateExcused: { $exists: true },
            })
                .toArray();
            const latenessSearch = studentLatenesses.some((lateness) => lateness.dayLateExcused === dayLateExcused);
            if (!latenessSearch) {
                const excusedLateness = {
                    student,
                    dayLateExcused,
                    markingPeriod,
                };
                const insertedId = yield studentData.insertOne(excusedLateness);
                excusedLateness._id = insertedId;
                return { excusedLateness };
            }
            else
                throw new Error(student.userName + ' already has absence assigned for ' + dayLateExcused);
        });
    },
});
//# sourceMappingURL=createExcusedLateness.js.map