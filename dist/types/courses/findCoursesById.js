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
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindCoursesByIdInput = schema_1.inputObjectType({
    name: 'FindCoursesByIdInput',
    definition(t) {
        t.list.id('_ids', { required: true });
    },
});
exports.FindCoursesByIdPayload = schema_1.objectType({
    name: 'FindCoursesByIdPayload',
    definition(t) {
        t.list.field('courses', { type: _1.Course });
    },
});
exports.FindCoursesById = schema_1.queryField('findCoursesById', {
    type: exports.FindCoursesByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindCoursesByIdInput, required: true }) },
    resolve(_, { input: { _ids } }, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = [];
            for (const _id of _ids) {
                const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(_id) });
                courses.push(course);
            }
            return { courses };
        });
    },
});
//# sourceMappingURL=findCoursesById.js.map