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
exports.CreateProtocol = exports.CreateProtocolPayload = exports.CreateProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.CreateProtocolInput = schema_1.inputObjectType({
    name: 'CreateProtocolInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.field('academicOutcomeType', {
            type: __1.AcademicOutcomeTypes,
            required: true,
        });
        t.field('protocolActivityType', {
            type: __1.ProtocolActivityTypes,
            required: true,
        });
        t.field('academicOutcomeType', {
            type: __1.AcademicOutcomeTypes,
            required: true,
        });
        t.string('task', { required: true });
        t.field('markingPeriod', { type: __1.MarkingPeriodEnum, required: true });
    },
});
exports.CreateProtocolPayload = schema_1.objectType({
    name: 'CreateProtocolPayload',
    definition(t) {
        t.list.field('protocols', { type: _1.Protocol });
    },
});
exports.CreateProtocol = schema_1.mutationField('createProtocol', {
    type: exports.CreateProtocolPayload,
    args: { input: schema_1.arg({ type: exports.CreateProtocolInput, required: true }) },
    resolve(_, { input: { studentIds, protocolActivityType, academicOutcomeType, task, markingPeriod, }, }, { protocolData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocols = [];
            for (const studentId of studentIds) {
                const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(studentId) });
                const protocolCheck = yield protocolData.findOne({
                    'student._id': new mongodb_1.ObjectId(studentId),
                    task,
                });
                if (!protocolCheck) {
                    const protocol = {
                        academicOutcomeType,
                        assignedDate: new Date().toLocaleDateString(),
                        isActive: true,
                        markingPeriod,
                        protocolActivityType,
                        completed: false,
                        startTime: new Date().toLocaleTimeString(),
                        student,
                        task,
                    };
                    const { insertedId } = yield protocolData.insertOne(protocol);
                    protocol._id = insertedId;
                    protocols.push(protocol);
                }
            }
            return { protocols };
        });
    },
});
//# sourceMappingURL=createProtocol.js.map