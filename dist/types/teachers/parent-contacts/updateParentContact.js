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
exports.UpdateParentContact = exports.UpdateParentContactPayload = exports.UpdateParentContactInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const __1 = require("..");
exports.UpdateParentContactInput = schema_1.inputObjectType({
    name: 'UpdateParentContactInput',
    definition(t) {
        t.id('contactId', { required: true });
        t.field('contactType', { type: __1.ContactTypeEnum, required: true });
        t.string('date', { required: true });
        t.id('studentId', { required: true });
        t.string('contentOfContact', { required: true });
        t.id('teacherId', { required: true });
    },
});
exports.UpdateParentContactPayload = schema_1.objectType({
    name: 'UpdateParentContactPayload',
    definition(t) {
        t.field('parentContact', { type: __1.ParentContact });
    },
});
exports.UpdateParentContact = schema_1.mutationField('updateParentContact', {
    type: exports.UpdateParentContactPayload,
    args: { input: schema_1.arg({ type: exports.UpdateParentContactInput, required: true }) },
    resolve(_, { input: { contactId, contactType, studentId, date, contentOfContact, teacherId, }, }, { teacherData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const parentContactCheck = yield teacherData.findOne({
                _id: new mongodb_1.ObjectId(contactId),
            });
            if (parentContactCheck) {
                yield teacherData.updateOne({ _id: new mongodb_1.ObjectId(contactId) }, {
                    contactType,
                    date,
                    studentId,
                    contentOfContact,
                    teacherId,
                });
                const parentContact = yield teacherData.findOne({
                    _id: new mongodb_1.ObjectId(contactId),
                });
                return { parentContact };
            }
            else
                throw new Error('This Contact does not exist');
        });
    },
});
//# sourceMappingURL=updateParentContact.js.map