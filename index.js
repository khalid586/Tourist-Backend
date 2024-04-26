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
    const database = client.db("userDatabase");
    const userData = database.collection('users')

    app.post('/users',async (req,res) =>{
      const user = req.body;
      const result = await userData.insertOne(user);
      res.send(result);
    })
    
    app.get('/users',async (req,res) =>{
      const Users = userData.find();
      const result = await Users.toArray();
      res.send(result);
    })
    app.delete('/users/:id',async (req,res) =>{
      const Id = req.params.id;
      const deletedUser = {_id: new ObjectId(Id)};
      const result = await userData.deleteOne(deletedUser);
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