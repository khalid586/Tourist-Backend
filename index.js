const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://assignment10-22b3d.web.app', 'http://localhost:5173',
    'https://tourist-1.web.app',
    'https://tourist-fa667.web.app',
  ],
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
    // await client.connect();
    const database = client.db("PlacesDatabase");
    const placesData = database.collection('places');
    const countriesCollection = database.collection('countries');

    app.get('/places',async (req,res) =>{
      const places = placesData.find().sort({_id: -1});
      const result = await places.toArray();
      res.send(result);
    })

    app.get('/countries',async(req,res)=>{
      try {
        const distinctCountriesCursor = await placesData.aggregate([
          { $group: { _id: "$country" } },
          { $project: { _id: 0, name: "$_id" } }
        ]);
        const distinctCountries = await distinctCountriesCursor.toArray();

        await countriesCollection.insertMany(distinctCountries.map(country => ({ name: country }))); 
        res.send(distinctCountries);
      } catch (error) {
        console.error("Error creating countries collection:", error);
        res.status(500).send("Internal Server Error has occured!!!!!");
      }
    })

    app.post('/places',async (req,res) =>{
      const place = req.body;

      const country = place.country.trim();
      place.country = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();

      const result = await placesData.insertOne(place);
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

       const country = Info.country.trim();
       Info.country = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
 

       const updatedInfo = {
            $set: {
              name: Info.name,
              country: Info.country,
              photoUrl: Info.photoUrl,
              avgCost: Info.avgCost,
              seasonality: Info.seasonality,
              description: Info.description,
              location:Info.location,
              email: Info.email,
              userName: Info.userName,
              travelTime:Info.travelTime,
              visitorsPerYear:Info.visitorsPerYear,
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
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('Running version 9')
})

app.listen(port,()=>{
    console.log(`App running at port ${port}`);
})

