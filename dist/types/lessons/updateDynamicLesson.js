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
exports.UpdateDynamicLesson = exports.UpdateDynamicLessonPayload = exports.UpdateDynamicLessonInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const dynamicLesson_1 = require("./dynamicLesson");
exports.UpdateDynamicLessonInput = schema_1.inputObjectType({
    name: 'UpdateDynamicLessonInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.field('dynamicLessonUpdate', { type: dynamicLesson_1.DynamicLessonEnums, required: true });
    },
});
exports.UpdateDynamicLessonPayload = schema_1.objectType({
    name: 'UpdateDynamicLessonPayload',
    definition(t) {
        t.field('lesson', { type: _1.Lesson });
    },
});
exports.UpdateDynamicLesson = schema_1.mutationField('UpdateDynamicLesson', {
    type: exports.UpdateDynamicLessonPayload,
    args: { input: schema_1.arg({ type: exports.UpdateDynamicLessonInput, required: true }) },
    resolve(_, { input: { lessonId, dynamicLessonUpdate } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonCheck = yield lessonData.findOne({
                _id: new mongodb_1.ObjectId(lessonId),
            });
            if (lessonCheck) {
                yield lessonData.updateOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                }, {
                    $set: {
                        dynamicLesson: dynamicLessonUpdate,
                    },
                });
                const lesson = yield lessonData.findOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                });
                return { lesson };
            }
            else
                throw new Error('Lesson does not exist.');
        });
    },
});
//# sourceMappingURL=updateDynamicLesson.js.map