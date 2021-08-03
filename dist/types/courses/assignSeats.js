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
exports.AssignSeats = exports.AssignSeatsPayload = exports.AssignSeatsInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.AssignSeatsInput = schema_1.inputObjectType({
    name: 'AssignSeatsInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.field('seat', { type: _1.StudentSeatInput });
        t.boolean('cohortBasedSeating', { required: true });
    },
});
exports.AssignSeatsPayload = schema_1.objectType({
    name: 'AssignSeatsPayload',
    definition(t) {
        t.field('courseInfo', { type: _1.CourseInfo });
    },
});
exports.AssignSeats = schema_1.mutationField('assignSeats', {
    type: exports.AssignSeatsPayload,
    args: { input: schema_1.arg({ type: exports.AssignSeatsInput, required: true }) },
    resolve(_, { input: { courseId, seat, cohortBasedSeating, }, }, { courseData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseValidation = yield courseData.findOne({
                'course._id': new mongodb_1.ObjectId(courseId),
            });
            if (courseValidation) {
                if (cohortBasedSeating) {
                    if (seat === null || seat === void 0 ? void 0 : seat.redCohortStudentId) {
                        const student = yield userData.findOne({
                            _id: new mongodb_1.ObjectId(seat.redCohortStudentId),
                        });
                        yield courseData.updateOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                            assignedSeats: {
                                $elemMatch: { deskNumber: seat.deskNumber },
                            },
                        }, {
                            $set: {
                                'assignedSeats.$.redCohortStudent': student,
                            },
                        });
                        const courseInfo = yield courseData.findOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                        });
                        return { courseInfo };
                    }
                    if (seat === null || seat === void 0 ? void 0 : seat.whiteCohortStudentId) {
                        const student = yield userData.findOne({
                            _id: new mongodb_1.ObjectId(seat === null || seat === void 0 ? void 0 : seat.whiteCohortStudentId),
                        });
                        yield courseData.updateOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                            assignedSeats: {
                                $elemMatch: { deskNumber: seat.deskNumber },
                            },
                        }, {
                            $set: {
                                'assignedSeats.$.whiteCohortStudent': student,
                            },
                        });
                        const courseInfo = yield courseData.findOne({
                            'course._id': new mongodb_1.ObjectId(courseId),
                        });
                        return { courseInfo };
                    }
                }
                const student = yield userData.findOne({
                    _id: new mongodb_1.ObjectId(seat === null || seat === void 0 ? void 0 : seat.studentId),
                });
                yield courseData.updateOne({
                    'course._id': new mongodb_1.ObjectId(courseId),
                    assignedSeats: {
                        $elemMatch: { deskNumber: seat === null || seat === void 0 ? void 0 : seat.deskNumber },
                    },
                }, {
                    $set: {
                        'assignedSeats.$.student': student,
                    },
                });
                const courseInfo = yield courseData.findOne({
                    'course._id': new mongodb_1.ObjectId(courseId),
                });
                return { courseInfo };
            }
            else
                throw new Error('Course Does Not Exist');
        });
    },
});
//# sourceMappingURL=assignSeats.js.map