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
exports.FinishProtocol = exports.FinishProtocolPayload = exports.FinishProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FinishProtocolInput = schema_1.inputObjectType({
    name: 'FinishProtocolInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.date('assignedDate', { required: true });
        t.string('task', { required: true });
        t.id('lessonId', { required: true });
    },
});
exports.FinishProtocolPayload = schema_1.objectType({
    name: 'FinishProtocolPayload',
    definition(t) {
        t.list.field('protocols', { type: _1.Protocol });
    },
});
exports.FinishProtocol = schema_1.mutationField('finishProtocol', {
    type: exports.FinishProtocolPayload,
    args: { input: schema_1.arg({ type: exports.FinishProtocolInput, required: true }) },
    resolve(_, { input: { studentIds, assignedDate, task, lessonId } }, { protocolData, lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocols = [];
            for (const studentId of studentIds) {
                yield protocolData.updateOne({
                    'student._id': new mongodb_1.ObjectId(studentId),
                    assignedDate,
                    task,
                }, {
                    $set: {
                        endTime: new Date().toLocaleTimeString(),
                        isActive: false,
                        completed: true,
                    },
                });
                const protocol = yield protocolData.findOne({
                    'student._id': new mongodb_1.ObjectId(studentId),
                    assignedDate,
                    task,
                });
                protocols.push(protocol);
            }
            if (protocols.length === studentIds.length) {
                const { modifiedCount } = yield lessonData.updateOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                    duringActivities: { $elemMatch: { task } },
                }, {
                    $set: {
                        'duringActivities.$.isActive': false,
                        'duringActivities.$.completed': true,
                    },
                });
            }
            return { protocols };
        });
    },
});
//# sourceMappingURL=finishProtocol.js.map