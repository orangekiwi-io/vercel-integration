import {connectToDatabase} from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);
    let limit = Math.floor(Math.random() * 20);
    if (limit < 1) limit = 1;

    console.log(`limit: ${limit}`);

    const results = await collection
      .find({})
      .project({
        grades: 0,
        borough: 0,
        restaurant_id: 0
      })
      .limit(limit)
      .toArray();

    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json(error);
  }
}
