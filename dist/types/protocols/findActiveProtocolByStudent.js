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
exports.FindActiveProtocolByStudent = exports.FindActiveProtocolByStudentPayload = exports.FindActiveProtocolByStudentInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindActiveProtocolByStudentInput = schema_1.inputObjectType({
    name: 'FindActiveProtocolByStudentInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindActiveProtocolByStudentPayload = schema_1.objectType({
    name: 'FindActiveProtocolByStudentPayload',
    definition(t) {
        t.field('protocol', { type: _1.Protocol });
    },
});
exports.FindActiveProtocolByStudent = schema_1.queryField('findActiveProtocolByStudent', {
    type: exports.FindActiveProtocolByStudentPayload,
    args: {
        input: schema_1.arg({ type: exports.FindActiveProtocolByStudentInput, required: true }),
    },
    resolve(_, { input: { studentId } }, { protocolData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocol = yield protocolData.findOne({
                'student._id': new mongodb_1.ObjectId(studentId),
                isActive: true,
            });
            return { protocol };
        });
    },
});
//# sourceMappingURL=findActiveProtocolByStudent.js.map