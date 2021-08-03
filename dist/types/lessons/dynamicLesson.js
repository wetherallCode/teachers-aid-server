"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicLessonEnums = void 0;
const schema_1 = require("@nexus/schema");
exports.DynamicLessonEnums = schema_1.enumType({
    name: 'DynamicLessonEnums',
    members: [
        'ON',
        'OFF',
        'WARM_UP',
        'PROTOCOLS',
        'VOCAB',
        'LESSON_DETAILS',
        'EXIT_ACTIVITY',
    ],
});
//# sourceMappingURL=dynamicLesson.js.map