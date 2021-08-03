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
exports.ControlWarmUp = exports.ControlWarmUpPayload = exports.ControlWarmUpInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.ControlWarmUpInput = schema_1.inputObjectType({
    name: 'ControlWarmUpInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.boolean('isActive', { required: true });
    },
});
exports.ControlWarmUpPayload = schema_1.objectType({
    name: 'ControlWarmUpPayload',
    definition(t) {
        t.field('lesson', { type: __1.Lesson });
    },
});
exports.ControlWarmUp = schema_1.mutationField('controlWarmUp', {
    type: exports.ControlWarmUpPayload,
    args: { input: schema_1.arg({ type: exports.ControlWarmUpInput, required: true }) },
    resolve(_, { input: { lessonId, isActive } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonCheck = yield lessonData.findOne({
                _id: new mongodb_1.ObjectId(lessonId),
            });
            if (lessonCheck) {
                yield lessonData.updateOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                }, {
                    $set: {
                        'beforeActivity.isActive': isActive,
                    },
                });
                return {
                    lesson: yield lessonData.findOne({
                        _id: new mongodb_1.ObjectId(lessonId),
                    }),
                };
            }
            else
                throw new Error('Lesson does not exist.');
        });
    },
});
//# sourceMappingURL=controlWarmUp.js.map