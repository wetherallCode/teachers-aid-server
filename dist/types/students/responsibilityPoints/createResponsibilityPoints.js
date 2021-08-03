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
exports.CreateResponsibilityPoints = exports.CreateResponsibilityPointsPayload = exports.CreateResponsibilityPointsInput = void 0;
const schema_1 = require("@nexus/schema");
const general_1 = require("../../general");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.CreateResponsibilityPointsInput = schema_1.inputObjectType({
    name: 'CreateResponsibilityPointsInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
        t.id('courseId', { required: true });
    },
});
exports.CreateResponsibilityPointsPayload = schema_1.objectType({
    name: 'CreateResponsibilityPointsPayload',
    definition(t) {
        t.list.field('responsibilityPoints', { type: __1.ResponsibilityPoints });
    },
});
exports.CreateResponsibilityPoints = schema_1.mutationField('createResponsibilityPoints', {
    type: exports.CreateResponsibilityPointsPayload,
    args: {
        input: schema_1.arg({ type: exports.CreateResponsibilityPointsInput, required: true }),
    },
    resolve(_, { input: { studentIds, markingPeriod, courseId } }, { studentData, userData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            let studentList = [];
            const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            for (const _id of studentIds) {
                const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(_id) });
                const responsibilityPointsCheck = yield studentData.findOne({
                    'student._id': new mongodb_1.ObjectId(_id),
                    responsibilityPoints: { $exists: true },
                    markingPeriod: markingPeriod,
                });
                if (student) {
                    if (!responsibilityPointsCheck) {
                        const responsibilityPoints = {
                            markingPeriod,
                            responsibilityPoints: 100,
                            student,
                            inCourse: course,
                        };
                        const { insertedId } = yield studentData.insertOne(responsibilityPoints);
                        responsibilityPoints._id = insertedId;
                        studentList.push(responsibilityPoints);
                    }
                    else
                        throw new Error('Student Responsibility Points have already been created for this marking period');
                }
                else
                    throw new Error('studentId unreckognized');
            }
            return { responsibilityPoints: studentList };
        });
    },
});
//# sourceMappingURL=createResponsibilityPoints.js.map