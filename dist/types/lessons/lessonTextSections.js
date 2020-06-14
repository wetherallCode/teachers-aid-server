"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
exports.LessonTextSections = schema_1.objectType({
    name: 'LessonTextSections',
    definition(t) {
        t.string('startingSection');
        t.string('endingSection');
    },
});
exports.LessonTextSectionsInput = schema_1.inputObjectType({
    name: 'LessonTextSectionsInput',
    definition(t) {
        t.string('startingSection', { required: true });
        t.string('endingSection', { required: true });
    },
});
//# sourceMappingURL=lessonTextSections.js.map