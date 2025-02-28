const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());//req body parser


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uomr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // CREATE DATABASE,COLLECTION
    const coffeeHub = client.db("coffeeDB");
    const coffeeCollection = coffeeHub.collection("coffeeCollection");

    // ALL server to MongoDB APIs

    app.post('/coffee',async(req,res)=>{
        console.log("Client data in server:=> ",req.body);

        const result=await coffeeCollection.insertOne(req.body)


        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// APIs
app.get("/", (req, res) => {
  res.send("Coffee server running...!");
});

// LISTEN to port
app.listen(port, () => {
  console.log("Coffee server running at port= ", port);
});
