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

    app.get("/singledata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await turistcolec.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/tourspot", async (req, res) => {
      const newTourspot = req.body;
      const result = await turistcolec.insertOne(newTourspot);
      res.send(result);
    });

    app.put("/updatsingledata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const updatData = {
        $set: {
          img: data.img,
          spotName: data.spotName,
          country: data.country,
          location: data.location,
          desc: data.desc,
          cost: data.cost,
          season: data.season,
          trvltime: data.trvltime,
          peryear: data.peryear,
        },
      };
      const result = await turistcolec.updateOne(query, updatData);
      res.send(result);
    });

    app.delete("/tourspot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await turistcolec.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
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
