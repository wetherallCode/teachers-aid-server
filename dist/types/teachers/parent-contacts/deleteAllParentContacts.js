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
exports.DeleteAllParentContacts = exports.DeleteAllParentContactsPayload = void 0;
const schema_1 = require("@nexus/schema");
exports.DeleteAllParentContactsPayload = schema_1.objectType({
    name: 'DeleteAllParentContactsPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.DeleteAllParentContacts = schema_1.mutationField('deleteAllParentContacts', {
    type: exports.DeleteAllParentContactsPayload,
    resolve(_, __, { teacherData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deletedCount } = yield teacherData.deleteMany({
                contentOfContact: { $exists: true },
            });
            console.log(deletedCount);
            return { removed: true };
        });
    },
});
//# sourceMappingURL=deleteAllParentContacts.js.map