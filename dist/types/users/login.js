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
exports.login = exports.LoginPayload = exports.LoginInput = void 0;
const schema_1 = require("@nexus/schema");
const argon2_1 = require("argon2");
const _1 = require(".");
exports.LoginInput = schema_1.inputObjectType({
    name: 'LoginInput',
    definition(t) {
        t.string('userName', { required: true });
        t.string('password', { required: true });
    },
});
exports.LoginPayload = schema_1.objectType({
    name: 'LoginPayload',
    definition(t) {
        t.field('user', { type: _1.User });
    },
});
exports.login = schema_1.mutationField('login', {
    type: exports.LoginPayload,
    args: {
        input: schema_1.arg({ type: exports.LoginInput, required: true }),
    },
    resolve(_, { input: { userName, password } }, { req, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userData.findOne({ userName });
            if (!user) {
                throw new Error('Wrong User Name');
            }
            const valid = yield argon2_1.verify(user.password, password);
            user.id = user._id.toString();
            req.session.userId = user.id;
            console.log((req.session.userId = user.id));
            return { user: user };
        });
    },
});
//# sourceMappingURL=login.js.map