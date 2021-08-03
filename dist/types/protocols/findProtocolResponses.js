"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProtocolResponsesPayload = exports.FindProtocolResponsesInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindProtocolResponsesInput = schema_1.inputObjectType({
    name: 'FindProtocolResponsesInput',
    definition(t) {
        t.id('protocolId', { required: true });
    },
});
exports.FindProtocolResponsesPayload = schema_1.objectType({
    name: 'FindProtocolResponsesPayload',
    definition(t) {
        t.field('protocol   ', { type: _1.Protocol });
    },
});
//# sourceMappingURL=findProtocolResponses.js.map