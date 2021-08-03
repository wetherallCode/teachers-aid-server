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
exports.MarkAllProtocolsInactive = exports.MarkAllProtocolsInactivePayload = void 0;
const schema_1 = require("@nexus/schema");
exports.MarkAllProtocolsInactivePayload = schema_1.objectType({
    name: 'MarkAllProtocolsInactivePayload',
    definition(t) {
        t.boolean('inactive');
    },
});
exports.MarkAllProtocolsInactive = schema_1.mutationField('markAllProtocolsInactive', {
    type: exports.MarkAllProtocolsInactivePayload,
    resolve(_, __, { protocolData }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield protocolData.updateMany({ isActive: true }, { $set: { isActive: false } });
            return { inactive: true };
        });
    },
});
//# sourceMappingURL=markAllProtocolsInactive.js.map