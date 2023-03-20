import fastify from 'fastify'
import mercurius, {
  IFieldResolver,
  IResolvers,
  MercuriusContext,
} from 'mercurius'
import { context } from './context'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from './resolvers'
import { typeDefs } from './schema'

declare module 'mercurius' {}
const app = fastify()

const schema = app.register(mercurius, {
  schema: makeExecutableSchema({
    resolvers,
    typeDefs,
  }),
  graphiql: true,
  context: () => context,
})

app.listen({ port: 4000 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)s
  }
  console.log(`\
  🚀 Server ready at: http://localhost:4000/graphiql
  `)
})
