"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.StudentInformation = schema_1.objectType({
    name: 'StudentInformation',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('student', { type: _1.Student });
        t.list.field('contactInfo', { type: _1.ContactInfo });
    },
});
//# sourceMappingURL=studentInformation.js.map