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
exports.FindParentContactsByTeacherId = exports.FindParentContactsByTeacherIdPayload = exports.FindParentContactsByTeacherIdInput = void 0;
const schema_1 = require("@nexus/schema");
const parentContact_1 = require("./parentContact");
exports.FindParentContactsByTeacherIdInput = schema_1.inputObjectType({
    name: 'FindParentContactsByTeacherIdInput',
    definition(t) {
        t.id('teacherId', { required: true });
    },
});
exports.FindParentContactsByTeacherIdPayload = schema_1.objectType({
    name: 'FindParentContactsByTeacherIdPayload',
    definition(t) {
        t.list.field('parentContacts', { type: parentContact_1.ParentContact });
    },
});
exports.FindParentContactsByTeacherId = schema_1.queryField('findParentContactsByTeacherId', {
    type: exports.FindParentContactsByTeacherIdPayload,
    args: {
        input: schema_1.arg({ type: exports.FindParentContactsByTeacherIdInput, required: true }),
    },
    resolve(_, { input: { teacherId } }, { teacherData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const parentContacts = yield teacherData
                .find({ teacherId: teacherId })
                .toArray();
            return { parentContacts };
        });
    },
});
//# sourceMappingURL=findParentContactsByTeacherId.js.map