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
exports.UnitInput = exports.Unit = void 0;
const schema_1 = require("@nexus/schema");
const lessons_1 = require("../lessons");
exports.Unit = schema_1.objectType({
    name: 'Unit',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('unitName');
        t.list.field('hasLessons', {
            type: lessons_1.Lesson,
            resolve(parent, __, { lessonData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const lessons = yield lessonData
                        .find({ 'inUnit._id': parent._id })
                        .toArray();
                    return lessons;
                });
            },
        });
    },
});
exports.UnitInput = schema_1.inputObjectType({
    name: 'UnitInput',
    definition(t) {
        t.id('_id', { required: true });
        t.string('unitName', { required: true });
    },
});
//# sourceMappingURL=unit.js.map