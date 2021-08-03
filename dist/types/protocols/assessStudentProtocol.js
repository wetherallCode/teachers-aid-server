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
exports.AssessStudentProtocol = exports.AssessStudentProtocolPayload = exports.AssessStudentProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const __1 = require("..");
const general_1 = require("../general");
exports.AssessStudentProtocolInput = schema_1.inputObjectType({
    name: 'AssessStudentProtocolInput',
    definition(t) {
        t.string('task', { required: true });
        t.field('protocolActivityType', {
            type: __1.ProtocolActivityTypes,
            required: true,
        });
        t.string('assignedDate');
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
        t.list.id('partnerIds');
        t.id('studentId', { required: true });
        t.field('discussionLevel', { type: _1.DiscussionTypesEnum });
        t.field('assessment', { type: _1.ProtocolAssessmentEnum });
    },
});
exports.AssessStudentProtocolPayload = schema_1.objectType({
    name: 'AssessStudentProtocolPayload',
    definition(t) {
        t.list.field('protocols', { type: _1.Protocol });
    },
});
exports.AssessStudentProtocol = schema_1.mutationField('assessStudentProtocol', {
    type: exports.AssessStudentProtocolPayload,
    args: { input: schema_1.arg({ type: exports.AssessStudentProtocolInput, required: true }) },
    resolve(_, { input: { task, assignedDate, markingPeriod, protocolActivityType, partnerIds, discussionLevel, assessment, studentId, }, }, { protocolData, userData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocols = [];
            const groupIds = partnerIds.length > 0 ? [...partnerIds, studentId] : [studentId];
            for (const _id of groupIds) {
                if (protocolActivityType !== 'INDIVIDUAL') {
                    const partnerToExclude = groupIds.findIndex((i) => i === _id);
                    const partners = [
                        ...groupIds.slice(0, partnerToExclude),
                        ...groupIds.slice(partnerToExclude + 1),
                    ];
                    const partnerObjects = [];
                    for (const partnerId of partners) {
                        const partner = yield userData.findOne({
                            _id: new mongodb_1.ObjectId(partnerId),
                        });
                        partnerObjects.push(partner);
                    }
                    yield protocolData.updateOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        task,
                        assignedDate,
                    }, {
                        $set: { partners: partnerObjects, discussionLevel, assessment },
                    });
                    const protocol = yield protocolData.findOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        task,
                        assignedDate,
                    });
                    protocols.push(protocol);
                }
                else {
                    yield protocolData.updateOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        task,
                        assignedDate,
                        protocolActivityType,
                    }, {
                        $set: { assessment },
                    });
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(studentId),
                        markingPeriod: markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: {
                            responsibilityPoints: assessment === 'WORKED_WELL' ? 1 : 2,
                        },
                    });
                    const protocol = yield protocolData.findOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        task,
                        assignedDate,
                    });
                    protocols.push(protocol);
                }
            }
            return { protocols };
        });
    },
});
//# sourceMappingURL=assessStudentProtocol.js.map