"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.Reading_Guide = schema_1.objectType({
    name: 'Reading_Guide',
    definition(t) {
        t.implements('Assignment');
        t.string('completion');
    },
});
//# sourceMappingURL=readingGuides.js.map