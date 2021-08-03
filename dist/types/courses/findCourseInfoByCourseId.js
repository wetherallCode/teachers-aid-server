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
exports.FindCourseInfoByCourseId = exports.FindCourseInfoByCourseIdPayload = exports.FindCourseInfoByCourseIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindCourseInfoByCourseIdInput = schema_1.inputObjectType({
    name: 'FindCourseInfoByCourseIdInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.FindCourseInfoByCourseIdPayload = schema_1.objectType({
    name: 'FindCourseInfoByCourseIdPayload',
    definition(t) {
        t.field('courseInfo', { type: _1.CourseInfo });
    },
});
exports.FindCourseInfoByCourseId = schema_1.queryField('findCourseInfoByCourseId', {
    type: exports.FindCourseInfoByCourseIdPayload,
    args: { input: schema_1.arg({ type: exports.FindCourseInfoByCourseIdInput, required: true }) },
    resolve(_, { input: { courseId } }, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({
                'course._id': new mongodb_1.ObjectId(courseId),
            });
            if (course) {
                return { courseInfo: course };
            }
            else
                throw new Error('Course does not exist.');
        });
    },
});
//# sourceMappingURL=findCourseInfoByCourseId.js.map