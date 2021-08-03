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
exports.AddUserEmail = exports.AddUserEmailPayload = exports.AddUserEmailInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.AddUserEmailInput = schema_1.inputObjectType({
    name: 'AddUserEmailInput',
    definition(t) {
        t.id('userId', { required: true });
        t.string('email');
    },
});
exports.AddUserEmailPayload = schema_1.objectType({
    name: 'AddUserEmailPayload',
    definition(t) {
        t.field('user', { type: _1.User });
    },
});
exports.AddUserEmail = schema_1.mutationField('addUserEmail', {
    type: exports.AddUserEmailPayload,
    args: { input: schema_1.arg({ type: exports.AddUserEmailInput, required: true }) },
    resolve(_, { input: { userId, email } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCheck = yield userData.findOne({ _id: new mongodb_1.ObjectId(userId) });
            if (userCheck) {
                yield userData.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                    $set: { email },
                });
                const user = yield userData.findOne({ _id: new mongodb_1.ObjectId(userId) });
                return { user };
            }
            else
                throw new Error('User does not exist.');
        });
    },
});
//# sourceMappingURL=addUserEmail.js.map