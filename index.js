const express = require( 'express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycbv1lf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const artCollection = client.db('artDB').collection('artsItem');

// create
    app.post('/arts',async(req,res)=>{
      const newArt = req.body;
      console.log(newArt)
      const result = await artCollection.insertOne(newArt);
      res.send(result)
  })
// read
  app.get('/arts/:email', async(req,res)=>{
   
    const result = await artCollection.find({email:req.params.email}).toArray()
    res.send(result)
})
// update
app.get('/craftDetails/:id', async(req,res)=>{
  const result = await artCollection.findOne({_id: new ObjectId(req.params.id)})
  res.send(result)
})

app.put('/updateCraft/:id', async(req,res)=>{
  const query = {_id: new ObjectId(req.params.id)};
  const data ={
    $set:{
       item_name : req.body.item_name,
       subcategory_name :req.body.subcategory_name,
       rating :req.body.rating,
       short_description:req.body.short_description,
       price:req.body.price,
       customization:req.body.customization,
       processing_time:req.body.processing_time,
       stockStatus :req.body.stockStatus,
       image : req.body.image
    }
  }
  const result= await artCollection.updateOne(query,data)
  res.send(result)
})
// delete
app.delete('/deleteCraft/:id', async(req,res)=>{
  const result = await artCollection.deleteOne({_id: new ObjectId(req.params.id)})
  res.send(result)
})
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`server is running on port:${port}`)
})