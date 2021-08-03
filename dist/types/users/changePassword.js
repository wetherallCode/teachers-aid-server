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
exports.ChangePassword = exports.ChangePasswordPayload = exports.ChangePasswordInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const argon2_1 = require("argon2");
exports.ChangePasswordInput = schema_1.inputObjectType({
    name: 'ChangePasswordInput',
    definition(t) {
        t.string('userName', { required: true });
        t.string('oldPassword', { required: true });
        t.string('newPassword', { required: true });
    },
});
exports.ChangePasswordPayload = schema_1.objectType({
    name: 'ChangePasswordPayload',
    definition(t) {
        t.field('user', { type: _1.User });
    },
});
exports.ChangePassword = schema_1.mutationField('changePassword', {
    type: exports.ChangePasswordPayload,
    args: { input: schema_1.arg({ type: exports.ChangePasswordInput, required: true }) },
    resolve(_, { input: { userName, oldPassword, newPassword } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCheck = yield userData.findOne({ userName });
            const hashedPassword = yield argon2_1.hash(newPassword);
            if (!userCheck) {
                throw new Error('Wrong User Name');
            }
            const valid = yield argon2_1.verify(userCheck.password, oldPassword);
            if (!valid) {
                throw new Error('Wrong Password');
            }
            else {
                userData.updateOne({ userName }, {
                    $set: {
                        password: hashedPassword,
                    },
                });
            }
            const user = yield userData.findOne({ userName });
            return { user };
        });
    },
});
//# sourceMappingURL=changePassword.js.map