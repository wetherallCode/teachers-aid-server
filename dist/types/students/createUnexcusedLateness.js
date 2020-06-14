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
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.CreateUnexcusedLatenessInput = schema_1.inputObjectType({
    name: 'CreateUnexcusedLatenessInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.date('dayLate', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.CreateUnexcusedLatenessPayload = schema_1.objectType({
    name: 'CreateUnexcusedLatenessPayload',
    definition(t) {
        t.field('unexcusedLateness', { type: _1.UnexcusedLateness });
    },
});
exports.CreateUnexcusedLateness = schema_1.mutationField('createUnexcusedLateness', {
    type: exports.CreateUnexcusedLatenessPayload,
    args: {
        input: schema_1.arg({ type: exports.CreateUnexcusedLatenessInput, required: true }),
    },
    resolve(_, { input: { studentId, dayLate, markingPeriod } }, { userData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield userData.findOne({
                _id: new mongodb_1.ObjectId(studentId),
            });
            const studentLatenesses = yield studentData
                .find({
                'student._id': new mongodb_1.ObjectId(student._id),
                dayLate: { $exists: true },
            })
                .toArray();
            const latenessSearch = studentLatenesses.some((lateness) => lateness.dayLate === dayLate);
            if (!latenessSearch) {
                const unexcusedLateness = {
                    student,
                    dayLate,
                    markingPeriod,
                };
                const insertedId = yield studentData.insertOne(unexcusedLateness);
                unexcusedLateness._id = insertedId;
                return { unexcusedLateness };
            }
            else
                throw new Error(student.userName + ' already has absence assigned for ' + dayLate);
        });
    },
});
//# sourceMappingURL=createUnexcusedLateness.js.map