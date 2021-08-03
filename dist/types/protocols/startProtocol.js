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
exports.StartProtocol = exports.StartProtocolPayload = exports.StartProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const lessons_1 = require("../lessons");
const mongodb_1 = require("mongodb");
exports.StartProtocolInput = schema_1.inputObjectType({
    name: 'StartProtocolInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.string('task', { required: true });
        t.boolean('isActive', { required: true });
    },
});
exports.StartProtocolPayload = schema_1.objectType({
    name: 'StartProtocolPayload',
    definition(t) {
        t.field('lesson', { type: lessons_1.Lesson });
    },
});
exports.StartProtocol = schema_1.mutationField('startProtocol', {
    type: exports.StartProtocolPayload,
    args: { input: schema_1.arg({ type: exports.StartProtocolInput, required: true }) },
    resolve(_, { input: { lessonId, task, isActive } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonCheck = yield lessonData.findOne({
                _id: new mongodb_1.ObjectId(lessonId),
            });
            if (lessonCheck) {
                yield lessonData.updateOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                    duringActivities: { $elemMatch: { task } },
                }, {
                    $set: {
                        'duringActivities.$.isActive': isActive,
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
//# sourceMappingURL=startProtocol.js.map