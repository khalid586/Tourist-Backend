const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://assignment10-22b3d.web.app', 'http://localhost:5173'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

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
    app.get('/places/:email',async (req,res) =>{
      const email = req.params.email;
      const query = {email};
      const places = placesData.find(query);
      const result = await places.toArray();
      res.send(result);
    })

    app.get('/details/:id', async(req,res)=>{
      const Id = req.params.id;
      const query = {_id: new ObjectId(Id)};
      const place = await placesData.findOne(query);
      res.send(place); 
    })
    app.get('/update/:id', async(req,res)=>{
      const Id = req.params.id;
      const query = {_id: new ObjectId(Id)};
      const place = await placesData.findOne(query);
      res.send(place); 
    })

    app.put('/update/:id', async(req,res) =>{
       const Id = req.params.id;
       const Info = req.body;

       const filter = {_id:new ObjectId(Id)};
       const options = {upsert:true};



       const updatedInfo = {
         $set:{
          name:Info.name,
          country:Info.country,
          photoUrl:Info.photoUrl,
          userName:Info.userName,
          email:Info.email
         }
       }

       console.log(updatedInfo)


       const result = await placesData.updateOne(filter,updatedInfo,options);
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
  } catch(error){
    console.error(error)
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('testing if it is working')
})

app.listen(port,()=>{
    console.log(`App running at port ${port}`);
})

