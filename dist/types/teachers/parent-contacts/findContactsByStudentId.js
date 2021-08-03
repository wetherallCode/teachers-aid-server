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
exports.FindContactsByStudentId = exports.FindContactsByStudentIdPayload = exports.FindContactsByStudentIdInput = void 0;
const schema_1 = require("@nexus/schema");
const bson_1 = require("bson");
const parentContact_1 = require("./parentContact");
exports.FindContactsByStudentIdInput = schema_1.inputObjectType({
    name: 'FindContactsByStudentIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindContactsByStudentIdPayload = schema_1.objectType({
    name: 'FindContactsByStudentIdPayload',
    definition(t) {
        t.list.field('parentContacts', { type: parentContact_1.ParentContact });
    },
});
exports.FindContactsByStudentId = schema_1.queryField('findContactsByStudentId', {
    type: exports.FindContactsByStudentIdPayload,
    args: { input: schema_1.arg({ type: exports.FindContactsByStudentIdInput, required: true }) },
    resolve(_, { input: { studentId } }, { teacherData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const parentContacts = yield teacherData
                .find({ 'student._id': new bson_1.ObjectId(studentId) })
                .toArray();
            return { parentContacts };
        });
    },
});
//# sourceMappingURL=findContactsByStudentId.js.map