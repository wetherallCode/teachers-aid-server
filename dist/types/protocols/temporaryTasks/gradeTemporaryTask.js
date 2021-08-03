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
exports.GradeTemporaryTask = exports.GradeTemporaryTaskPayload = exports.GradeTemporaryTaskInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.GradeTemporaryTaskInput = schema_1.inputObjectType({
    name: 'GradeTemporaryTaskInput',
    definition(t) {
        t.id('_id', { required: true });
        t.boolean('answered', { required: true });
        t.float('responsibilityPoints', { required: true });
        t.float('lastGrade', { required: true });
    },
});
exports.GradeTemporaryTaskPayload = schema_1.objectType({
    name: 'GradeTemporaryTaskPayload',
    definition(t) {
        t.field('temporaryTask', { type: _1.TemporaryTask });
    },
});
exports.GradeTemporaryTask = schema_1.mutationField('gradeTemporaryTask', {
    type: exports.GradeTemporaryTaskPayload,
    args: { input: schema_1.arg({ type: exports.GradeTemporaryTaskInput, required: true }) },
    resolve(_, { input: { _id, answered, responsibilityPoints, lastGrade } }, { temporaryTaskData, generalData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryTaskCheck = yield temporaryTaskData.findOne({
                _id: new mongodb_1.ObjectId(_id),
            });
            console.log(new Date().toLocaleTimeString());
            const mp = yield generalData.findOne({
                currentMarkingPeriod: { $exists: true },
            });
            if (temporaryTaskCheck) {
                const studentId = temporaryTaskCheck.student._id;
                yield temporaryTaskData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                    $set: {
                        answered,
                        lastGrade: temporaryTaskCheck.answered && !answered
                            ? 0
                            : responsibilityPoints,
                    },
                });
                if (temporaryTaskCheck.answered && !answered) {
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(studentId),
                        markingPeriod: mp.currentMarkingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: { responsibilityPoints: -lastGrade },
                    });
                }
                if (!temporaryTaskCheck.answered && answered) {
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(studentId),
                        markingPeriod: mp.currentMarkingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: { responsibilityPoints: responsibilityPoints },
                    });
                }
                const temporaryTask = yield temporaryTaskData.findOne({
                    _id: new mongodb_1.ObjectId(_id),
                });
                return { temporaryTask };
            }
            else
                throw new Error('Task not created');
        });
    },
});
//# sourceMappingURL=gradeTemporaryTask.js.map