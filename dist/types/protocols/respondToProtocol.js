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
exports.RespondToProtocol = exports.RespondToProtocolPayload = exports.RespondToProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.RespondToProtocolInput = schema_1.inputObjectType({
    name: 'RespondToProtocolInput',
    definition(t) {
        t.id('protocolId', { required: true });
        t.string('response', { required: true });
    },
});
exports.RespondToProtocolPayload = schema_1.objectType({
    name: 'RespondToProtocolPayload',
    definition(t) {
        t.field('protocol', { type: _1.Protocol });
    },
});
exports.RespondToProtocol = schema_1.mutationField('respondToProtocol', {
    type: exports.RespondToProtocolPayload,
    args: { input: schema_1.arg({ type: exports.RespondToProtocolInput, required: true }) },
    resolve(_, { input: { protocolId, response } }, { protocolData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocolCheck = yield protocolData.findOne({
                _id: new mongodb_1.ObjectId(protocolId),
            });
            if (protocolCheck) {
                yield protocolData.updateOne({
                    _id: new mongodb_1.ObjectId(protocolId),
                }, {
                    $set: { response },
                });
            }
            const protocol = yield protocolData.findOne({
                _id: new mongodb_1.ObjectId(protocolId),
            });
            return { protocol };
        });
    },
});
//# sourceMappingURL=respondToProtocol.js.map