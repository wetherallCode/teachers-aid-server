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
        '../src/practice-api-typegen.ts'
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
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // httpOnly: false,
        // sameSite: 'none',
        // secure: true,
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
    context: async ({ req, res }: any) => {
      let userData = db.collection('userData')
      let assignmentData = db.collection('assignmentData')
      let courseData = db.collection('courseData')

      return {
        req,
        res,
        userData,
        assignmentData,
        courseData,
        db,
      }
    },
  })

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3001',
    },
  })

  app.listen({ port: 4005 }, () =>
    console.log(`🚀 Server ready at http://localhost:4005${server.graphqlPath}`)
  )
}

startServer()
