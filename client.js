// #### Pls run the server.js first ####
const request = require('request');

// #### Insert a message ####
const author = 'andy';
const content = 'hope is a good thing';

const query = `mutation CreateMessage($input: MessageInput) {
  createMessage(input: $input) {
    id
  }
}`;
const options = {
    url: 'http://localhost:4000/graphql',
    body: {
        query: query,
        variables: {
            input: {
                author: author,
                content: content,
            }
        }
    },
    json: true,
};

function callback(error, response, body) {
    console.log('data returned:', body);
    queryMessage(body.data.createMessage.id);
}

request.post(options, callback);

// #### Query a message ####
function queryMessage(id) {
    const query = `query GetMsgFunc($id: ID!) {
  getMessage(id: $id) {
    content
  }
}`;
    const options = {
        url: 'http://localhost:4000/graphql',
        body: {
            query: query,
            variables: {
                id: id,
            }
        },
        json: true,
    };

    function callback(error, response, body) {
        console.log('data returned:', body);
    }

    request.post(options, callback);
}