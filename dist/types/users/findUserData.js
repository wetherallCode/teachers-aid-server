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
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindUserDataInput = schema_1.inputObjectType({
    name: 'FindUserDataInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.FindUserDataPayload = schema_1.objectType({
    name: 'FindUserDataPayload',
    definition(t) {
        t.field('user', { type: _1.User });
    },
});
exports.FindUserData = schema_1.queryField('findUserData', {
    type: exports.FindUserDataPayload,
    args: { input: schema_1.arg({ type: exports.FindUserDataInput, required: true }) },
    resolve(_, { input: { _id } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userData.findOne({ _id: new mongodb_1.ObjectId(_id) });
            return { user };
        });
    },
});
//# sourceMappingURL=findUserData.js.map