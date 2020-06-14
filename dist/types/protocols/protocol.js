"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.Protocol = schema_1.interfaceType({
    name: 'Protocol',
    definition(t) {
        t.id('_id', { nullable: true });
        t.date('assignedDate');
        t.boolean('isActive');
        t.resolveType((protocol) => {
            if (protocol.hasOwnProperty('studentPair')) {
                return 'ThinkPairShare';
            }
            return 'Individual';
        });
    },
});
//# sourceMappingURL=protocol.js.map