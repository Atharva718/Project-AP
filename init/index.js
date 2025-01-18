const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });


async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner:"67829b10a91e8eac882dbdac"}));    // this is thw 2nd method of seeding data
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
// 6782475fbbbed90ada924282