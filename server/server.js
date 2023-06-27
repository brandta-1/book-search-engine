const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// create an instance of ApolloServer that uses our defined typeDefs and resolvers, as well as authMiddleware context
// context allows data to be shared throughout server resolvers, in this case, the resolvers will usually need information about who is logged in, so this is the context, provided via JWT
// context has to return a value, which in the cause of authMiddleWare, is simply the http request with an added data property, which will (hopefully) contain the logged in user's info
const server = new ApolloServer({ typeDefs, resolvers, context: authMiddleware });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });

};

startApolloServer(typeDefs, resolvers);

