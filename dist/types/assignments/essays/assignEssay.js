"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.AssignEssayInput = schema_1.inputObjectType({
    name: 'AssignEssayInput',
    definition(t) {
        t.boolean('assigned');
    },
});
exports.AssignEssayPayload = schema_1.objectType({
    name: 'AssignEssayPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
//# sourceMappingURL=assignEssay.js.map