const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://User:PL3VGW1BXEM4KGbU@cluster0.pf9u5p6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Done successfully!')
})

app.listen(PORT,()=>{
    console.log(`App running at port ${PORT}`);
})