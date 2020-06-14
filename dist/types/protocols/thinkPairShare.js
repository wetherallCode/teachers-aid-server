"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const __1 = require("..");
exports.ThinkPairShare = schema_1.objectType({
    name: 'ThinkPairShare',
    definition(t) {
        t.implements('Protocol');
        t.list.field('studentPair', { type: __1.Student });
        t.boolean('hadConversation');
    },
});
//# sourceMappingURL=thinkPairShare.js.map