"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.MarkingPeriod = schema_1.objectType({
    name: 'MarkingPeriod',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('currentMarkingPeriod', { type: exports.MarkingPeriodEnum });
    },
});
exports.MarkingPeriodEnum = schema_1.enumType({
    name: 'MarkingPeriodEnum',
    members: ['FIRST', 'SECOND', 'THIRD', 'FOURTH'],
});
//# sourceMappingURL=markingPeriod.js.map