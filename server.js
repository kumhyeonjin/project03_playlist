const express = require("express");
const app = express();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use("/public", express.static("public"));

const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://jinie:hjjmjy0412@cluster0.dm4lh47.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const postCollection = client.db("project3").collection("post");
    const counterCollection = client.db("project3").collection("count");

    //GET
    app.get("/", async (req, res) => {
      // const query = {};
      const cursor = postCollection.find({});
      const result = (await cursor.toArray()).sort().reverse();
      res.render("list.ejs", { post: result });
    });

    app.get("/write", (req, res) => {
      res.render("write.ejs");
    });

    app.get("/detail/:id", async function (req, res) {
      const result = await postCollection.findOne({
        _id: parseInt(req.params.id),
      });
      const cursor = postCollection.find({});
      const result2 = (await cursor.toArray()).sort().reverse();
      res.render("detail.ejs", { data: result, data2: result2 });
    });

    app.get("/edit/:id", async function (req, res) {
      const result = await postCollection.findOne({
        _id: parseInt(req.params.id),
      });
      res.render("edit.ejs", { post: result });
    });

    //POST
    app.post("/add", async function (req, res) {
      const { title, date, good } = req.body;
      const { totalcounter } = await counterCollection.findOne({
        name: "count",
      });
      await postCollection.insertOne({
        _id: totalcounter + 1,
        postTitle: title,
        postDate: date,
        postPoint: good,
      });
      await counterCollection.updateOne(
        { name: "count" },
        { $inc: { totalcounter: 1 } }
      );
      res.redirect("/");
    });

    // DELETE
    app.delete("/delete", async function (req, res) {
      req.body._id = parseInt(req.body._id);
      await postCollection.deleteOne(req.body);
      res.status(200).send();
    });

    //PUT
    app.put("/edit", async (req, res) => {
      const { id, title, date } = req.body;
      await postCollection.updateOne(
        { _id: parseInt(id) },
        { $set: { postTitle: title, postDate: date } }
      );
      res.redirect("/");
    });

    app.put("/good", async (req, res) => {
      const { _id, postPoint } = req.body;
      await postCollection.updateOne(
        { _id: parseInt(_id) },
        { $set: { postPoint: postPoint } }
      );
      res.status(200).send();
    });
  } finally {
  }
}

main().catch();

app.listen(8080);
