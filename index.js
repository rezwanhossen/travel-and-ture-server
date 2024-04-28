const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5001;

const app = express();
//meddil wair =======
app.use(cors());
app.use(express.json());

//=================================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsxvars.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const turistcolec = client.db("turestSpotDB").collection("turestSpot");

    app.get("/tourspot", async (req, res) => {
      const cursor = turistcolec.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/tourspot/:email", async (req, res) => {
      const email = req.params.email;
      const result = await turistcolec.find({ email: email }).toArray();
      res.send(result);
    });

    app.post("/tourspot", async (req, res) => {
      const newTourspot = req.body;
      const result = await turistcolec.insertOne(newTourspot);
      res.send(result);
    });

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

//===================================================
app.get("/", (req, res) => {
  res.send("was running");
});
app.listen(port, () => {
  console.log(`running on port : ${port}`);
});
