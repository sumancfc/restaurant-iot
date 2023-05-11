const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const port =  9090;

const uri = "mongodb+srv://lkaushalya97:Kau1997@cluster0.tnm4noc.mongodb.net/resturant?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });
//connect to mongodb
async function run() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Resturant Lovers");
});

// get all the resturants
app.get("/resturant", async (req, res) => {
  const resturants = client.db("resturant").collection("resturants");

  const allresturantsList = await resturants.find().toArray();

  res.status(200).json(allresturantsList);
});

// add resturant in the list
app.post("/resturant/add", async (req, res) => {
  const resturants = client.db("resturant").collection("resturants");
  const { name, city, food, parking, review } = req.body;

  const resturant = await resturants.insertOne({
    name,
    city,
    food,
    parking,
    review,
  });

  res.status(201).json({ message: "New resturant has been created", resturant });
});

//get single resturant by id
app.get("/resturant/:id", async (req, res) => {
  const resturants = client.db("resturant").collection("resturants");
  const { id } = req.params;

  const resturant = await resturants.findOne({ _id: new ObjectId(id) });
  res.status(200).json(resturant);
});

// update resturant using id
app.put("/resturant/:id", async (req, res) => {
  const resturants = client.db("resturant").collection("resturants");
  const { id } = req.params;
  const updateresturant = req.body;

  const resturant = await resturants.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateresturant }
  );

  res.status(200).json({ message: "Resturant has been updated.", resturant });
});

// delete resturant using id
app.delete("/resturant/:id", async (req, res) => {
  const resturants = client.db("resturant").collection("resturants");
  const { id } = req.params;

  await resturants.deleteOne({ _id: new ObjectId(id) });
  res.status(200).json("Resturant has been deleted.");
});

run()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch(console.dir);
