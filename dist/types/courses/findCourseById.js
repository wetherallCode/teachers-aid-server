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
exports.FindCourseById = exports.FindCourseByIdPayload = exports.FindCourseByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindCourseByIdInput = schema_1.inputObjectType({
    name: 'FindCourseByIdInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.FindCourseByIdPayload = schema_1.objectType({
    name: 'FindCourseByIdPayload',
    definition(t) {
        t.field('course', { type: _1.Course });
    },
});
exports.FindCourseById = schema_1.queryField('findCourseById', {
    type: exports.FindCourseByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindCourseByIdInput, required: true }) },
    resolve(_, { input: { courseId } }, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            return { course };
        });
    },
});
//# sourceMappingURL=findCourseById.js.map