import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import * as express from 'express'
import * as session from 'express-session'
import { MongoClient } from 'mongodb'
const MongoDBStore = require('connect-mongodb-session')(session)
const path = require('path')
import { makeSchema } from '@nexus/schema'
import * as types from './types'

const startServer = async () => {
  const app = express()

  const schema = makeSchema({
    types,
    outputs: {
      schema: path.join(__dirname, '../teachers-aid.graphql'),
      typegen: path.join(
        __dirname.replace(/\/dist$/, '/src'),
        '../src/teachers-aid-typegen.ts'
      ),
    },
    typegenAutoConfig: {
      sources: [
        {
          source: path.join(
            __dirname.replace(/\/dist$/, '/src'),
            './typeDefs.ts'
          ),
          alias: 't',
        },
      ],
      contextType: 't.Context',
    },
  })

  const store = new MongoDBStore({
    uri: process.env.MONGO_SESSION_STORAGE,
    collection: 'mySessions',
  })

  store.on('error', function (error: any) {
    console.log('error in store: ' + error)
  })

  app.set('trust proxy', 1)
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      cookie: {
        // maxAge: 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 90,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      store: store,
      saveUninitialized: false,
    }) as any
  )

  const MONGO_DB = process.env.DB_HOST
  const client = await MongoClient.connect(MONGO_DB as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = client.db()

  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    engine: {
      apiKey: 'service:teachers-aid-server:AVsJ7hHBz2dGu9JYONV84g',
    },
    context: async ({ req, res }: any) => {
      let userData = db.collection('userData')
      let assignmentData = db.collection('assignmentData')
      let courseData = db.collection('courseData')
      let textSectionData = db.collection('textSectionData')
      let textData = db.collection('textData')
      let lessonData = db.collection('lessonData')
      let generalData = db.collection('generalData')
      let studentData = db.collection('studentData')
      let rubricData = db.collection('rubricData')
      let protocolData = db.collection('protocolData')
      let schoolDayData = db.collection('schoolDayData')

      return {
        req,
        res,
        userData,
        assignmentData,
        studentData,
        courseData,
        textSectionData,
        textData,
        lessonData,
        generalData,
        rubricData,
        protocolData,
        schoolDayData,
        db,
      }
    },
  })

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ['https://mrwetherall.org', 'http://localhost:3000'],
    },
  })
  const PORT = process.env.PORT || 4000
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at${server.graphqlPath}`)
  )
}

startServer()
