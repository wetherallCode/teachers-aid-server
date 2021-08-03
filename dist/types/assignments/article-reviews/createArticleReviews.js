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
exports.CreateArticleReviews = exports.CreateArticleReviewsPayload = exports.CreateArticleReviewsInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const __1 = require("..");
const __2 = require("../..");
exports.CreateArticleReviewsInput = schema_1.inputObjectType({
    name: 'CreateArticleReviewsInput',
    definition(t) {
        t.string('hasAssignerId', { required: true });
        t.list.id('assignedCourseId', { required: true });
        t.field('markingPeriod', { type: __2.MarkingPeriodEnum, required: true });
        t.string('dueDate', { required: true });
        t.field('dueTime', { type: __1.TimeOfDayEnum, required: true });
        t.string('assignedDate', { required: true });
    },
});
exports.CreateArticleReviewsPayload = schema_1.objectType({
    name: 'CreateArticleReviewsPayload',
    definition(t) {
        t.list.field('articleReviews', { type: _1.ArticleReview });
    },
});
exports.CreateArticleReviews = schema_1.mutationField('createArticleReviews', {
    type: exports.CreateArticleReviewsPayload,
    args: { input: schema_1.arg({ type: exports.CreateArticleReviewsInput, required: true }) },
    resolve(_, { input: { hasAssignerId, assignedCourseId, dueDate, assignedDate, markingPeriod, }, }, { userData, assignmentData, studentData, }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(new Date().toISOString().substring(17, 20));
            const assigner = yield userData.findOne({
                _id: new mongodb_1.ObjectId(hasAssignerId),
            });
            const studentList = [];
            for (const _id of assignedCourseId) {
                const students = yield userData
                    .find({
                    'inCourses._id': new mongodb_1.ObjectId(_id),
                })
                    .toArray();
                for (const student of students) {
                    studentList.push(student);
                }
            }
            const newArticleReviews = [];
            for (const student of studentList) {
                const newArticleReview = {
                    articleAuthor: '',
                    articleLink: '',
                    articleTitle: '',
                    publishedDate: '',
                    assigned: true,
                    bias: null,
                    issue: '',
                    solutions: '',
                    topicsImportance: '',
                    assignedDate,
                    dueDate,
                    dueTime: '8:00:00 AM',
                    exempt: false,
                    hasAssigner: assigner,
                    hasOwner: student,
                    late: true,
                    markingPeriod,
                    paperBased: false,
                    score: {
                        earnedPoints: 0,
                        maxPoints: 10,
                    },
                    completed: false,
                    submitted: false,
                    returned: false,
                };
                yield studentData.updateOne({
                    'student._id': new mongodb_1.ObjectId(student._id),
                    markingPeriod,
                    responsibilityPoints: { $exists: true },
                }, {
                    $inc: { responsibilityPoints: -2 },
                });
                const { insertedId } = yield assignmentData.insertOne(newArticleReview);
                newArticleReview._id = insertedId;
                newArticleReviews.push(newArticleReview);
            }
            console.log(new Date().toISOString().substring(17, 20));
            return { articleReviews: newArticleReviews };
        });
    },
});
//# sourceMappingURL=createArticleReviews.js.map