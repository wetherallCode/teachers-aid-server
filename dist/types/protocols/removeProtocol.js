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
exports.RemoveProtocol = exports.RemoveProtocolPayload = exports.RemoveProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
exports.RemoveProtocolInput = schema_1.inputObjectType({
    name: 'RemoveProtocolInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.date('assignedDate', { required: true });
        t.string('task', { required: true });
        t.id('lessonId', { required: true });
    },
});
exports.RemoveProtocolPayload = schema_1.objectType({
    name: 'RemoveProtocolPayload',
    definition(t) {
        t.int('deleteCount');
    },
});
exports.RemoveProtocol = schema_1.mutationField('removeProtocol', {
    type: exports.RemoveProtocolPayload,
    args: { input: schema_1.arg({ type: exports.RemoveProtocolInput, required: true }) },
    resolve(_, { input: { studentIds, assignedDate, task, lessonId } }, { protocolData, lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteCount = 0;
            for (const studentId of studentIds) {
                const protocolCheck = yield protocolData.findOne({
                    'student._id': new mongodb_1.ObjectId(studentId),
                    assignedDate,
                    task,
                });
                if (protocolCheck) {
                    const { deletedCount } = yield protocolData.deleteOne({
                        'student._id': new mongodb_1.ObjectId(studentId),
                        assignedDate,
                        task,
                    });
                    if (deletedCount === 1) {
                        deleteCount = deleteCount + 1;
                    }
                }
            }
            if (deleteCount === studentIds.length) {
                const { modifiedCount } = yield lessonData.updateOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                    duringActivities: { $elemMatch: { task } },
                }, {
                    $set: {
                        'duringActivities.$.isActive': false,
                        'duringActivities.$.completed': false,
                    },
                });
            }
            return { deleteCount };
        });
    },
});
//# sourceMappingURL=removeProtocol.js.map