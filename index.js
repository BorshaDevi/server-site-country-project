const express =require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors')
require('dotenv').config()
const app=express()
const port =process.env.PORT || 5000

// 'https://server-site-country-project-ih6092fcv-borshadevis-projects.vercel.app'

const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
  app.use(cors(corsConfig))
// app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DE_Name}:${process.env.DE_Pass}@cluster0.uqcmivv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client
  .connect()
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
  
    const countryCollection = client.db("countryDB").collection("country");
    const challengesCollection = client.db("challengesDB").collection("challenges");

    app.get('/addSpots/:Id',async(req,res)=> {
      const id=req.params.Id
      const query = { _id: new ObjectId(id) };
      const result = await countryCollection.findOne(query);
      res.send(result)
    })
    app.get('/addSpots',async(req,res)=>{
      const cursor = countryCollection.find();
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/addSpotsbyemail/:email',async(req,res)=>{
         const email=req.params.email;
        
         const queryData = { email: email };
    
    
      
       try{
        const result = countryCollection .find(queryData);
        const data=await result.toArray()
        res.send(data)
       }catch(error){
        console.log(error)
        res.status(500).send('server error')
       }
    })
    app.get('/challenge',async(req,res)=>{
      const filter=req.query.filter
      console.log(filter)
      
      let query={}
      if(filter) query={season:filter}

      const cursor = challengesCollection.find(query);
      const result=await cursor.toArray()
      console.log(result)
      res.send(result)
    })


    app.get('/challenge/:Id',async(req,res)=> {
      const id=req.params.Id
      const query = { _id: new ObjectId(id) };
      const result = await challengesCollection.findOne(query);
      res.send(result)
    })
    app.get('/addSpotsSort',async(req,res)=> {
      // const options = {
        
      //   sort: { cost: 1 },
       
      //   projection: { _id: 0, cost: 1, },
      // };
      const result = db.country.find().sort({ cost: 1});
      
      res.send(result)
      console.log(result)
    })
    app.post('/addSpots',async(req,res) => {
      const user=req.body;
      
      const result = await countryCollection.insertOne(user);
      res.send(result)
    })
    app.put('/addSpots/:id',async(req,res) => {
      const id =req.params.id
      const userBody=req.body
      const filter = { _id : new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          description:userBody.description,
          photo:userBody.photo,
          season:userBody.season,
          spotName:userBody.spotName,
          country:userBody.country,
          location:userBody.location,
          time:userBody.time,
          perYear:userBody.perYear,
          cost:userBody.cost,
        },
      };
      const result = await countryCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
    app.delete('/addSpots/:Id',async(req,res)=>{
      const id=req.params.Id
      const value= { _id: new ObjectId(id) };
      const result = await countryCollection.deleteOne(value);
      res.send(result)
    })
    
    
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=> {
    res.send('hello everyone')
})
app.listen(port,() => {
    console.log(`this server site from ${port}`)
})