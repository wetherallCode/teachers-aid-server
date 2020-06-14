"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.Test = schema_1.objectType({
    name: 'Test',
    definition(t) {
        t.implements('Assignment');
        t.string('testName');
    },
});
//# sourceMappingURL=tests.js.map