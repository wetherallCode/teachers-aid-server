"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactTypeEnum = exports.ParentContact = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("../..");
exports.ParentContact = schema_1.objectType({
    name: 'ParentContact',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('contactType', { type: exports.ContactTypeEnum });
        t.string('date');
        t.field('student', { type: __1.Student });
        t.string('contentOfContact');
        t.id('teacherId');
    },
});
exports.ContactTypeEnum = schema_1.enumType({
    name: 'ContactTypeEnum',
    members: ['PHONE', 'EMAIL', 'VIDEO'],
});
//# sourceMappingURL=parentContact.js.map