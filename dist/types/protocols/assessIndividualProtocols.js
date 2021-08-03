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
exports.AssessIndividualProtocols = exports.AssessIndividualProtocolsPayload = exports.AssessIndividualProtocolsInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const general_1 = require("../general");
exports.AssessIndividualProtocolsInput = schema_1.inputObjectType({
    name: 'AssessIndividualProtocolsInput',
    definition(t) {
        t.id('protocolId', { required: true });
        t.field('markingPeriod', { required: true, type: general_1.MarkingPeriodEnum });
        t.field('assessment', { type: _1.ProtocolAssessmentEnum, nullable: true });
    },
});
exports.AssessIndividualProtocolsPayload = schema_1.objectType({
    name: 'AssessIndividualProtocolsPayload',
    definition(t) {
        t.field('protocol', { type: _1.Protocol });
    },
});
exports.AssessIndividualProtocols = schema_1.mutationField('assessIndividualProtocols', {
    type: exports.AssessIndividualProtocolsPayload,
    args: {
        input: schema_1.arg({ type: exports.AssessIndividualProtocolsInput, required: true }),
    },
    resolve(_, { input: { protocolId, markingPeriod, assessment } }, { protocolData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocol = yield protocolData.findOne({
                _id: new mongodb_1.ObjectId(protocolId),
            });
            if (protocol) {
                protocolData.updateOne({
                    _id: new mongodb_1.ObjectId(protocolId),
                }, {
                    $set: {
                        completed: true,
                        assessment,
                    },
                });
                console.log(protocol.assessment === null && assessment !== null);
                if (protocol.assessment === null && assessment !== null) {
                    studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(protocol.student._id),
                        markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, { $inc: { responsibilityPoints: 2 } });
                }
                if (assessment === null) {
                    studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(protocol.student._id),
                        markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, { $inc: { responsibilityPoints: -2 } });
                }
                return { protocol };
            }
            else
                throw new Error('Protocol does not exist');
        });
    },
});
//# sourceMappingURL=assessIndividualProtocols.js.map