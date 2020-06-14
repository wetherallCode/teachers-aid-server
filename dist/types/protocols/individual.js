"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const students_1 = require("../students");
const schema_1 = require("@nexus/schema");
exports.Individual = schema_1.objectType({
    name: 'Individual',
    definition(t) {
        t.implements('Protocol');
        t.field('student', { type: students_1.Student });
    },
});
//# sourceMappingURL=individual.js.map