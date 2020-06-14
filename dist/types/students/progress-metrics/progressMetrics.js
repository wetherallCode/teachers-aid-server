"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const __1 = require("..");
exports.ProgressMetrics = schema_1.interfaceType({
    name: 'ProgressMetrics',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: __1.Student });
        t.resolveType(() => {
            if (name === 'WritingMetrics') {
                return 'WritingMetrics';
            }
            return 'ComprehensionMetrics';
        });
    },
});
//# sourceMappingURL=progressMetrics.js.map