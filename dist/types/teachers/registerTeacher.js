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
exports.RegisterTeacher = exports.RegisterTeacherPayload = exports.RegisterTeacherInput = void 0;
const schema_1 = require("@nexus/schema");
const argon2_1 = require("argon2");
const __1 = require("..");
exports.RegisterTeacherInput = schema_1.inputObjectType({
    name: 'RegisterTeacherInput',
    definition(t) {
        t.string('email', { required: true });
        t.string('password', { required: true });
        t.string('userName', { required: true });
        t.string('firstName', { required: true });
        t.string('lastName', { required: true });
        t.field('title', {
            type: __1.TitleEnum,
            required: true,
        });
    },
});
exports.RegisterTeacherPayload = schema_1.objectType({
    name: 'RegisterTeacherPayload',
    definition(t) {
        t.field('teacher', { type: __1.Teacher });
    },
});
exports.RegisterTeacher = schema_1.mutationField('registerTeacher', {
    type: exports.RegisterTeacherPayload,
    args: {
        input: schema_1.arg({ type: exports.RegisterTeacherInput, required: true }),
    },
    resolve(_, { input: { userName, firstName, lastName, email, password, title } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingUser = yield userData.findOne({ userName });
            if (!existingUser) {
                const hashedPassword = yield argon2_1.hash(password);
                let newTeacher = {
                    email,
                    password: hashedPassword,
                    userName,
                    firstName,
                    lastName,
                    title,
                    teachesCourses: [],
                };
                const { insertedId } = yield userData.insertOne(newTeacher);
                newTeacher._id = insertedId;
                return { teacher: newTeacher };
            }
            else
                throw new Error(`${userName} already exists. Create a new username.`);
        });
    },
});
//# sourceMappingURL=registerTeacher.js.map