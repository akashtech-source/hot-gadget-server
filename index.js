const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
require('dotenv').config();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hot Gadget Server!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apc6x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const smartPhoneCollection = client.db("gadgetDb").collection("smartphone");
  

  app.get('/smartPhone', (req, res) => {
    smartPhoneCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.get(`/checkout/:id`, (req, res) => {
    smartPhoneCollection.find({
      _id: ObjectId(req.params.id)
    })
    .toArray((err, items) => {
      res.send(items)
      console.log(items);
    })
  })


  app.post('/addSmartPhone', (req, res) => {
    const newSmartPhone = req.body;
    console.log('adding new phone: ', newSmartPhone);
    smartPhoneCollection.insertOne(newSmartPhone)
    .then(result => {
      console.log('inserted Count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

//   client.close();
});


app.listen(port, () => {
  console.log(`Your Server Running at http://localhost:${port}`)
})