const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL =
  "mongodb+srv://raiyan-mukhi:WrnoeM1h9tjFdNv8@cluster0.yzdcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // initData.data = initData.data.map((obj) => ({
  //   ...obj,
  //   owner: "66f7a6211eb14f19719ab7bc",
  // }));
  // await Listing.insertMany(initData.data);
  console.log("data was deleted");
};

initDB();
