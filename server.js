import express from 'express';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import path from 'path';

import schema from './src/schemas';
import resolvers from './src/resolvers';

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/graphql', (req, res) => graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: {req, res}
})(req, res));

app.listen(PORT);

mongoose.connect(
    'mongodb://localhost:27017/webixGraphqlDB',
    {useNewUrlParser: true, useFindAndModify: false},
    (err, db) => {
        if (!err) console.log('Mongo connected');
});
