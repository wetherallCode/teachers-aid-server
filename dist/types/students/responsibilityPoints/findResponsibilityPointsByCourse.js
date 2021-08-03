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
exports.FindResponsibilityPointsByCourse = exports.FindResponsibilityPointsByCoursePayload = exports.FindResponsibilityPointsByCourseInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const __1 = require("..");
exports.FindResponsibilityPointsByCourseInput = schema_1.inputObjectType({
    name: 'FindResponsibilityPointsByCourseInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.FindResponsibilityPointsByCoursePayload = schema_1.objectType({
    name: 'FindResponsibilityPointsByCoursePayload',
    definition(t) {
        t.list.field('responsibilityPointList', { type: __1.ResponsibilityPoints });
    },
});
exports.FindResponsibilityPointsByCourse = schema_1.queryField('findResponsibilityPointsByCourse', {
    type: exports.FindResponsibilityPointsByCoursePayload,
    args: {
        input: schema_1.arg({
            type: exports.FindResponsibilityPointsByCourseInput,
            required: true,
        }),
    },
    resolve(_, { input: { courseId } }, { studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const responsibilityPointList = yield studentData
                .find({
                'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                responsibilityPoints: { $exists: true },
            })
                .toArray();
            return { responsibilityPointList };
        });
    },
});
//# sourceMappingURL=findResponsibilityPointsByCourse.js.map