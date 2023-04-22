const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.1xniais.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const serviceCollections = client.db("genius-car").collection("services");
  const OrderCollection = client.db("genius-car").collection("orders");
  const ContactDataCollection = client.db("genius-car").collection("contact");
  const ProductDataCollection = client.db("genius-car").collection("products");
  try {
    /* service collection data */
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await serviceCollections.insertOne(service);
      res.send(result);
    });
    app.get("/service", async (req, res) => {
      const result = await serviceCollections.find({}).toArray();
      res.send(result);
    });
    app.get("/service/:id", async (req, res) => {
      const result = await serviceCollections.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    /* Order collection data */
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await OrderCollection.insertOne(order);
      console.log(result);
      res.send(result);
    });
    app.get("/order", async (req, res) => {
      const order = await OrderCollection.find({}).toArray();
      res.send(order);
    });
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await OrderCollection.findOne(query);
      res.send(order);
    });
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deletedOrder = await OrderCollection.deleteOne(query);
      res.send(deletedOrder);
      console.log(query, deletedOrder);
    });
    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          customerMessage: order.customerMessage,
        },
      };
      const updateOrder = await OrderCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(updateOrder);
      console.log(updateOrder);
    });
    /* Contact data collection */
    app.post("/contact", async (req, res) => {
      const contact = req.body;
      const result = await ContactDataCollection.insertOne(contact);
      res.send(result);
    });
    app.get("/contact", async (req, res) => {
      const contactData = await ContactDataCollection.find({}).toArray();
      res.send(contactData);
    });
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await ProductDataCollection.insertOne(product);
      res.send(result);
    });
    app.get("/product", async (req, res) => {
      const productData = await ProductDataCollection.find({}).toArray();
      res.send(productData);
    });
  } finally {
  }
}
run().catch(console.dir);
/* test case  */
app.get("/", (req, res, next) => {
  res.send("genius car server is running on port " + port);
});
app.listen(port, () => console.log(`server is running on ${port}`));
