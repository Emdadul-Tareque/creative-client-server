const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("images"));
app.use(fileUpload());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuz7l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("creativeAgency").collection("services");
  const orderCollection = client.db("creativeAgency").collection("orders");
  const reviewCollection = client.db("creativeAgency").collection("review");
  const adminCollection = client.db("creativeAgency").collection("Admin");

  app.post("/addAService", (req, res) => {
    const file = req.files.file;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const title = req.body.title;
    const description = req.body.description;
    const image = file.name;

    file.mv(`${__dirname}/images/${file.name}`, (err) => {
      if (err) {
        console.log(err);
        return res.status(5000).send({ msg: "Failed to upload Image" });
      }
      return res.send({ name: file.name, path: `/${file.name}` });
    });

    console.log(userName, userEmail, title, description, image);

    serviceCollection
      .insertOne({ userName, userEmail, title, description, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.post("/addAOrder", (req, res) => {
    const file = req.files.file;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const serviceName = req.body.serviceName;
    const details = req.body.details;
    const price = req.body.price;
    const image = file.name;

    file.mv(`${__dirname}/images/${file.name}`, (err) => {
      if (err) {
        console.log(err);
        return res.status(5000).send({ msg: "Failed to upload Image" });
      }
      return res.send({ name: file.name, path: `/${file.name}` });
    });

    console.log(userName, userEmail, serviceName, details, price, image);

    orderCollection
      .insertOne({ userName, userEmail, serviceName, details, price, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.post("/review", (req, res) => {
    const name = req.body.name;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userImage = req.body.userImage;
    const company = req.body.company;
    const description = req.body.description;

    console.log(name, userEmail, userName, userImage, company, description);

    reviewCollection
      .insertOne({ name, userEmail, userName, userImage, company, description })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
  app.post("/addAdmin", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    console.log(name, email, userEmail, userName);

    adminCollection
      .insertOne({
        name,
        email,
        userEmail,
        userName,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/getServices", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/getReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/getReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/userOrder", (req, res) => {
    orderCollection
      .find({ userEmail: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/getOrder", (req, res) => {
    orderCollection
      .find({})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/getAdmin", (req, res) => {
    adminCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(process.env.PORT || port)
