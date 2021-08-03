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
exports.RemoveCourse = exports.RemoveCoursePayload = exports.RemoveCourseInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
exports.RemoveCourseInput = schema_1.inputObjectType({
    name: 'RemoveCourseInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.RemoveCoursePayload = schema_1.objectType({
    name: 'RemoveCoursePayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.RemoveCourse = schema_1.mutationField('removeCourse', {
    type: exports.RemoveCoursePayload,
    args: { input: schema_1.arg({ type: exports.RemoveCourseInput, required: true }) },
    resolve(_, { input: { courseId } }, { courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deletedCount } = yield courseData.deleteOne({
                _id: new mongodb_1.ObjectId(courseId),
            });
            if (deletedCount === 1) {
                return { removed: true };
            }
            else
                return { removed: false };
        });
    },
});
//# sourceMappingURL=removeCourse.js.map