const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schemas");
const graphQLResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    console.log(err || "MongoDB Connected");
  }
);

app.use(isAuth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
