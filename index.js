const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());

app.use(express.json());


require('dotenv').config();
const uri = process.env.MONGO_URL

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    const database = client.db("PlacesDatabase");
    const placesData = database.collection('places')

    app.post('/places',async (req,res) =>{
      const place = req.body;
      const result = await placesData.insertOne(place);
      res.send(result);
    })
    
    app.get('/places',async (req,res) =>{
      const places = placesData.find();
      const result = await places.toArray();
      res.send(result);
    })
    app.delete('/places/:id',async (req,res) =>{
      const Id = req.params.id;
      const deletedplace = {_id: new ObjectId(Id)};
      const result = await placesData.deleteOne(deletedplace);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch{
    console.error(error)
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`App running at port ${port}`);
})
