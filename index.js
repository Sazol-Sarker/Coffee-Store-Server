const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://coffee-store-4ab55.web.app",
      "https://coffee-store-4ab55.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json()); //req body parser

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uomr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    // CREATE DATABASE,COLLECTION
    const coffeeHub = client.db("coffeeDB");
    const coffeeCollection = coffeeHub.collection("coffeeCollection");

    // ALL server to MongoDB APIs
    // GET (ALL) API
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });
    // GET specific coffee API
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(typeof id);
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // POST API
    app.post("/coffee", async (req, res) => {
      console.log("Client data in server:=> ", req.body);

      const result = await coffeeCollection.insertOne(req.body);

      res.send(result);
    });

    // DELETE API
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id got from client=>", id);
      const query = { _id: new ObjectId(id) };

      const result = await coffeeCollection.deleteOne(query);

      res.send(result);
    });

    // PUT UPDATE API
    // app.get(`/coffee/:id`, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await coffeeCollection.findOne(query);

    //   res.send(result);
    // });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updCoffee = req.body;
      const updatedCoffee = {
        $set: {
          name: updCoffee.name,
          chefName: updCoffee.chefName,
          supplierName: updCoffee.supplierName,
          taste: updCoffee.taste,
          categoryName: updCoffee.categoryName,
          detailsName: updCoffee.detailsName,
          photoURL: updCoffee.photoURL,
        },
      };
      const options = { upsert: true };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedCoffee,
        options
      );

      res.send(result);
    });

    /*************** USER API */
    const userCollection = coffeeHub.collection("userCollection");
    // GET USERS ALL
    app.get("/users", async (req, res) => {
      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // CREATE USER=> POST API
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("Response from client to server:=>", user);
      // send to DB
      const result = await userCollection.insertOne(user);

      //Final/last response to client
      res.send(result);
    });

    // DELETE (Single) api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("ID got from client=>", id);

      // send delete instruction to DB
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);

      res.send(result);
    });

    // UPDATE edit api: user
    app.patch("/users", async (req, res) => {
      const email = req.body.email;
      const query = { email: email };

      const updatedUser = {
        $set: {
          email: email,
          lastSignInTime: req.body.lastSignInTime,
        },
      };
      const result = await userCollection.updateOne(query, updatedUser);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
