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
exports.CreateParentContact = exports.CreateParentContactPayload = exports.CreateParentContactInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.CreateParentContactInput = schema_1.inputObjectType({
    name: 'CreateParentContactInput',
    definition(t) {
        t.field('contactType', { type: __1.ContactTypeEnum, required: true });
        t.string('date', { required: true });
        t.id('studentId', { required: true });
        t.string('contentOfContact', { required: true });
        t.id('teacherId', { required: true });
    },
});
exports.CreateParentContactPayload = schema_1.objectType({
    name: 'CreateParentContactPayload',
    definition(t) {
        t.field('parentContact', { type: __1.ParentContact });
    },
});
exports.CreateParentContact = schema_1.mutationField('createParentContact', {
    type: exports.CreateParentContactPayload,
    args: { input: schema_1.arg({ type: exports.CreateParentContactInput, required: true }) },
    resolve(_, { input: { contactType, date, studentId, contentOfContact, teacherId } }, { teacherData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(studentId) });
            const newContact = {
                contactType,
                date,
                student: student,
                teacherId,
                contentOfContact,
            };
            const { insertedId } = yield teacherData.insertOne(newContact);
            newContact._id = insertedId;
            return { parentContact: newContact };
        });
    },
});
//# sourceMappingURL=createParentContact.js.map