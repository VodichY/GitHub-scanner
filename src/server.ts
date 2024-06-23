import { ApolloServer } from 'apollo-server';
import typeDefs from './services/GitHubService/schema';
import resolvers from './services/GitHubService/resolvers';

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
