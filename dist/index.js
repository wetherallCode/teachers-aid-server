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
require("reflect-metadata");
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const express = require("express");
const session = require("express-session");
const mongodb_1 = require("mongodb");
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const schema_1 = require("@nexus/schema");
const types = require("./types");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    const schema = schema_1.makeSchema({
        types,
        outputs: {
            schema: path.join(__dirname, '../teachers-aid.graphql'),
            typegen: path.join(__dirname.replace(/\/dist$/, '/src'), '../src/teachers-aid-typegen.ts'),
        },
        typegenAutoConfig: {
            sources: [
                {
                    source: path.join(__dirname.replace(/\/dist$/, '/src'), './typeDefs.ts'),
                    alias: 't',
                },
            ],
            contextType: 't.Context',
        },
    });
    const store = new MongoDBStore({
        uri: process.env.MONGO_SESSION_STORAGE,
        collection: 'mySessions',
    });
    store.on('error', function (error) {
        console.log('error in store: ' + error);
    });
    app.set('trust proxy', 1);
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        store: store,
        saveUninitialized: false,
    }));
    const MONGO_DB = process.env.DB_HOST;
    const client = yield mongodb_1.MongoClient.connect(MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db();
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        introspection: true,
        playground: true,
        engine: {
            apiKey: 'service:teachers-aid-server:AVsJ7hHBz2dGu9JYONV84g',
        },
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            let userData = db.collection('userData');
            let assignmentData = db.collection('assignmentData');
            let courseData = db.collection('courseData');
            let textSectionData = db.collection('textSectionData');
            let textData = db.collection('textData');
            let lessonData = db.collection('lessonData');
            let generalData = db.collection('generalData');
            let studentData = db.collection('studentData');
            let teacherData = db.collection('teacherData');
            let rubricData = db.collection('rubricData');
            let protocolData = db.collection('protocolData');
            let schoolDayData = db.collection('schoolDayData');
            let temporaryTaskData = db.collection('temporaryTaskData');
            return {
                req,
                res,
                userData,
                assignmentData,
                studentData,
                teacherData,
                courseData,
                textSectionData,
                textData,
                lessonData,
                generalData,
                rubricData,
                protocolData,
                schoolDayData,
                temporaryTaskData,
                db,
            };
        }),
    });
    server.applyMiddleware({
        app,
        cors: {
            credentials: true,
            origin: ['https://mrwetherall.org', 'http://localhost:3000'],
        },
    });
    const PORT = process.env.PORT || 4000;
    app.listen({ port: PORT }, () => console.log(`🚀 Server ready at${server.graphqlPath}`));
});
startServer();
//# sourceMappingURL=index.js.map