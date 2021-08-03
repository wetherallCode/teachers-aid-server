"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleEnum = exports.Teacher = void 0;
const schema_1 = require("@nexus/schema");
const users_1 = require("../users/users");
const __1 = require("..");
exports.Teacher = schema_1.objectType({
    name: 'Teacher',
    definition(t) {
        t.implements(users_1.User);
        t.field('title', { type: exports.TitleEnum });
        t.list.field('teachesCourses', {
            type: __1.Course,
        });
        t.list.field('hasParentContacts', {
            type: 'ParentContact',
            resolve(parent, __, { teacherData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const parentContacts = yield teacherData
                        .find({ teacherId: parent._id })
                        .toArray();
                    return parentContacts;
                });
            },
        });
    },
});
exports.TitleEnum = schema_1.enumType({
    name: 'TitleEnum',
    members: ['MR', 'MRS', 'MS', 'MISS'],
});
//# sourceMappingURL=teacher.js.map