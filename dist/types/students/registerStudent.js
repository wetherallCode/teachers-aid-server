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
const argon2_1 = require("argon2");
const _1 = require(".");
exports.RegisterStudentInput = schema_1.inputObjectType({
    name: 'RegisterStudentInput',
    definition(t) {
        t.string('email', { required: true });
        t.string('password', { required: true });
        t.string('userName', { required: true });
        t.string('firstName', { required: true });
        t.string('lastName', { required: true });
    },
});
exports.RegisterStudentPayload = schema_1.objectType({
    name: 'RegisterStudentPayload',
    definition(t) {
        t.field('student', { type: _1.Student });
    },
});
exports.RegisterStudent = schema_1.mutationField('registerStudent', {
    type: exports.RegisterStudentPayload,
    args: {
        input: schema_1.arg({ type: exports.RegisterStudentInput, required: true }),
    },
    resolve(_, { input: { userName, firstName, lastName, email, password } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingUser = yield userData.findOne({ userName });
            if (!existingUser) {
                const hashedPassword = yield argon2_1.hash(password);
                let newStudent = {
                    email,
                    password: hashedPassword,
                    userName,
                    firstName,
                    lastName,
                    inCourses: [],
                };
                const { insertedId } = yield userData.insertOne(newStudent);
                newStudent._id = insertedId;
                return { student: newStudent };
            }
            else
                throw new Error(`${userName} already exists. Create a new username.`);
        });
    },
});
//# sourceMappingURL=registerStudent.js.map