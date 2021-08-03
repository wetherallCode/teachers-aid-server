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
exports.AddAssociatedCourseId = exports.AddAssociatedCourseIdPayload = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.AddAssociatedCourseIdPayload = schema_1.objectType({
    name: 'AddAssociatedCourseIdPayload',
    definition(t) {
        t.list.field('courseInfo', { type: _1.CourseInfo });
    },
});
exports.AddAssociatedCourseId = schema_1.mutationField('addAssociatedCourseId', {
    type: exports.AddAssociatedCourseIdPayload,
    resolve(_, __, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            let courses = yield courseData
                .find({ startsAt: { $exists: true } })
                .toArray();
            for (let course of courses) {
                const count = yield courseData.updateOne({ 'course._id': course.course._id }, { $set: { associatedCourseId: course.course._id } });
            }
            courses = yield courseData.find({ startsAt: { $exists: true } }).toArray();
            return { courseInfo: courses };
        });
    },
});
//# sourceMappingURL=addAssociatedCourseId.js.map