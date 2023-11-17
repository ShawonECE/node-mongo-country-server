const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yhhqym.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("countryDB");
const coll = db.collection("sampleCountry");

app.get('/', (req, res) => {  
  client.connect()
  .then(() => coll.find({}).toArray())
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => client.close());
});

app.get('/:country', (req, res) => {
  const name = req.params.country;
  client.connect()
  .then(() => coll.find({}).toArray())
  .then(result => {
    const country = result.find(country => country.name.toLowerCase() === name.toLowerCase());
    res.send(country);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => client.close());
});

app.post('/addCountry', (req, res) =>{
  const countryToInsert = req.body;
  client.connect()
  .then(() => coll.insertOne(countryToInsert))
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => client.close());
});


app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  client.connect()
  .then(() => coll.deleteOne({_id: new ObjectId(id)}))
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => client.close());
});

app.listen(3000, () => console.log('Listening to port 3000'));