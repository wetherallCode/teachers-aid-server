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
exports.ControlCoolDown = exports.ControlCoolDownPayload = exports.ControlCoolDownInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.ControlCoolDownInput = schema_1.inputObjectType({
    name: 'ControlCoolDownInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.boolean('isActive', { required: true });
    },
});
exports.ControlCoolDownPayload = schema_1.objectType({
    name: 'ControlCoolDownPayload',
    definition(t) {
        t.field('lesson', { type: __1.Lesson });
    },
});
exports.ControlCoolDown = schema_1.mutationField('controlCoolDown', {
    type: exports.ControlCoolDownPayload,
    args: { input: schema_1.arg({ type: exports.ControlCoolDownInput, required: true }) },
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
                        'afterActivity.isActive': isActive,
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
//# sourceMappingURL=controlCoolDown.js.map