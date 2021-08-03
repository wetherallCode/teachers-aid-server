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
exports.RemoveAssignedSeat = exports.RemoveAssignedSeatPayload = exports.RemoveAssignedSeatInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const students_1 = require("../students");
exports.RemoveAssignedSeatInput = schema_1.inputObjectType({
    name: 'RemoveAssignedSeatInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.int('deskNumber', { required: true });
        t.boolean('cohortBased', { required: true });
        t.field('cohortType', { type: students_1.StudentCohortEnum });
    },
});
exports.RemoveAssignedSeatPayload = schema_1.objectType({
    name: 'RemoveAssignedSeatPayload',
    definition(t) {
        t.field('courseInfo', { type: _1.CourseInfo });
    },
});
exports.RemoveAssignedSeat = schema_1.mutationField('removeAssignedSeat', {
    type: exports.RemoveAssignedSeatPayload,
    args: { input: schema_1.arg({ type: exports.RemoveAssignedSeatInput, required: true }) },
    resolve(_, { input: { courseId, deskNumber, cohortBased, cohortType } }, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseValidation = yield courseData.findOne({
                'course._id': new mongodb_1.ObjectId(courseId),
            });
            if (courseValidation) {
                if (cohortBased) {
                    if (cohortType === 'RED') {
                        yield courseData.updateOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                            assignedSeats: {
                                $elemMatch: { deskNumber },
                            },
                        }, {
                            $set: {
                                'assignedSeats.$.redCohortStudent': null,
                            },
                        });
                        const courseInfo = yield courseData.findOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                        });
                        return { courseInfo };
                    }
                    if (cohortType === 'WHITE') {
                        yield courseData.updateOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                            assignedSeats: {
                                $elemMatch: { deskNumber },
                            },
                        }, {
                            $set: {
                                'assignedSeats.$.whiteCohortStudent': null,
                            },
                        });
                        const courseInfo = yield courseData.findOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                        });
                        return { courseInfo };
                    }
                }
                yield courseData.updateOne({
                    'course._id': new mongodb_1.ObjectId(courseId),
                    assignedSeats: {
                        $elemMatch: { deskNumber },
                    },
                }, {
                    $set: {
                        'assignedSeats.$.student': null,
                    },
                });
                const courseInfo = yield courseData.findOne({
                    'course._id': new mongodb_1.ObjectId(courseId),
                });
                return { courseInfo };
            }
            else
                throw new Error('Course does not exist.');
        });
    },
});
//# sourceMappingURL=removeAssignedSeat.js.map