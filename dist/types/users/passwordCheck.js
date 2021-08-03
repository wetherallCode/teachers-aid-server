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
exports.PasswordCheck = exports.PasswordCheckPayload = exports.PasswordCheckInput = void 0;
const schema_1 = require("@nexus/schema");
const argon2_1 = require("argon2");
exports.PasswordCheckInput = schema_1.inputObjectType({
    name: 'PasswordCheckInput',
    definition(t) {
        t.string('password', { required: true });
    },
});
exports.PasswordCheckPayload = schema_1.objectType({
    name: 'PasswordCheckPayload',
    definition(t) {
        t.boolean('firstTimeLoginIn');
    },
});
exports.PasswordCheck = schema_1.queryField('passwordCheck', {
    type: exports.PasswordCheckPayload,
    args: { input: schema_1.arg({ type: exports.PasswordCheckInput, required: true }) },
    resolve(_, { input: { password } }, ___) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = yield argon2_1.verify(password, 'password');
            return { firstTimeLoginIn: valid };
        });
    },
});
//# sourceMappingURL=passwordCheck.js.map