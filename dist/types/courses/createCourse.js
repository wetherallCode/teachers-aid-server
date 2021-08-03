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
exports.CreateCourse = exports.CreateCoursePayload = exports.CreateCourseInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.CreateCourseInput = schema_1.inputObjectType({
    name: 'CreateCourseInput',
    definition(t) {
        t.string('name', { required: true });
    },
});
exports.CreateCoursePayload = schema_1.objectType({
    name: 'CreateCoursePayload',
    definition(t) {
        t.field('course', { type: _1.Course });
    },
});
exports.CreateCourse = schema_1.mutationField('createCourse', {
    type: exports.CreateCoursePayload,
    args: { input: schema_1.arg({ type: exports.CreateCourseInput, required: true }) },
    resolve(_, { input: { name } }, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCourse = {
                name,
            };
            const { insertedId } = yield courseData.insertOne(newCourse);
            newCourse._id = insertedId;
            return { course: newCourse };
        });
    },
});
//# sourceMappingURL=createCourse.js.map