"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.User = schema_1.interfaceType({
    name: 'User',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('userName');
        t.string('firstName');
        t.string('lastName');
        t.string('email', { nullable: true });
        t.string('password');
        t.resolveType((user) => {
            if (user.hasOwnProperty('title')) {
                return 'Teacher';
            }
            return 'Student';
        });
    },
});
//# sourceMappingURL=users.js.map