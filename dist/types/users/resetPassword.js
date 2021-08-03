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
exports.ResetPassword = exports.ResetPasswordPayload = exports.ResetPasswordInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const argon2_1 = require("argon2");
exports.ResetPasswordInput = schema_1.inputObjectType({
    name: 'ResetPasswordInput',
    definition(t) {
        t.string('userId', { required: true });
    },
});
exports.ResetPasswordPayload = schema_1.objectType({
    name: 'ResetPasswordPayload',
    definition(t) {
        t.field('user', { type: _1.User });
    },
});
exports.ResetPassword = schema_1.mutationField('resetPassword', {
    type: exports.ResetPasswordPayload,
    args: { input: schema_1.arg({ type: exports.ResetPasswordInput, required: true }) },
    resolve(_, { input: { userId } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCheck = yield userData.findOne({ _id: new mongodb_1.ObjectId(userId) });
            const hashedPassword = yield argon2_1.hash('password');
            if (userCheck) {
                userData.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                    $set: {
                        password: hashedPassword,
                    },
                });
                const user = yield userData.findOne({ _id: new mongodb_1.ObjectId(userId) });
                return { user };
            }
            else
                throw new Error('User does not exist');
        });
    },
});
//# sourceMappingURL=resetPassword.js.map