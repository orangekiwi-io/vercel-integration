import { MongoClient } from "mongodb";

const uri = process.env.NEXT_ATLAS_URI;
const options = {};

if (!process.env.NEXT_ATLAS_URI) {
  throw new Error("Please dd your Mongo URI to .env.local");
}

export default async function handler(request, response) {
  try {
    const mongoClient = await (new MongoClient (uri, options)).connect();
    console.log("Just connected! [wrong way API]");

    const db = mongoClient.db("sample_restaurants");
    const collection = db.collection("restaurants");
    const results = await collection
      .find({})
      .project({
        grades: 0,
        borough: 0,
        restaurant_id: 0
      })
      .limit(4)
      .toArray();

      response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json(error);
  }
}