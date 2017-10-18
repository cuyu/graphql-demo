// Implement the server side code using GraphQL objects
// TODO: Not ready yet
var express = require('express');
var graphqlHTTP = require('express-graphql');
var {GraphQLSchema, GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID} = require('graphql');

const MessageInput = new GraphQLInputObjectType({
    name: 'MessageInput',
    fields: {
        content: {type: GraphQLString},
        author: {type: GraphQLString},
    },
});

const Msg = new GraphQLObjectType({
    name: 'Msg',
    fields: {
        id: {type: GraphQLID},
        content: {type: GraphQLString},
        author: {type: GraphQLString},
    },
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getMessage: {
            type: Msg,
            resolve(args, context, info) {
                console.log(info)
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createMessage: {
            type: Msg,
            resolve(args, context, info) {
                console.log(info)
            },
        },
        updateMessage: {
            type: Msg,
            resolve(args, context, info) {
                console.log(info)
            },
        },
    },

});

var schema = new GraphQLSchema({
    MessageInput: MessageInput,
    Message: Msg,
    query: Query,
    mutation: Mutation,
});

// If Message had any complex fields, we'd put them on this object.
class Message {
    constructor(id, {content, author}) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

// Maps username to content
var fakeDatabase = {};

var root = {
    getMessage: function ({id}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: function ({input}) {
        // Create a random id for our "database".
        var id = require('crypto').randomBytes(10).toString('hex');

        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage: function ({id, input}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});