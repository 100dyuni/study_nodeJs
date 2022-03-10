// @ts-check

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://duhuyn:qltTja!0902@cluster0.pwpas.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

module.exports = client