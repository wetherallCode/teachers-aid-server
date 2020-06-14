"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.ContactInfo = schema_1.objectType({
    name: 'ContactInfo',
    definition(t) {
        t.string('guardianFirstName');
        t.string('guardianLastName');
        t.string('guardianPhone');
        t.string('guardianEmail');
    },
});
//# sourceMappingURL=contactInfo.js.map