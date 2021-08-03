"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprehensionMetrics = void 0;
const schema_1 = require("@nexus/schema");
exports.ComprehensionMetrics = schema_1.objectType({
    name: 'ComprehensionMetrics',
    definition(t) {
        t.typeName;
        t.implements('ProgressMetrics');
        t.int('comprehensionLevel');
    },
});
//# sourceMappingURL=comprehensionMetrics.js.map