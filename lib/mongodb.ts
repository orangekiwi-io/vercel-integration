// SOURCES:
// https://www.youtube.com/watch?v=JIlYroSsInU
// https://www.mongodb.com/developer/languages/javascript/integrate-mongodb-vercel-functions-serverless-experience/
import { Db, MongoClient } from "mongodb";

const uri = process.env.NEXT_ATLAS_URI!;
const options = {};

let globalWithMongo = global as typeof globalThis & {
  _mongoClient: MongoClient;
}

let mongoClient: MongoClient | null = null;
let database: Db | null = null;

if ( !process.env.NEXT_ATLAS_URI )
{
  throw new Error( 'Please add your Mongo URI to .env.local' )
}

export async function connectToDatabase() {
  try
  {
    if ( mongoClient && database )
    {
      return { mongoClient, database };
    }
    if ( process.env.NODE_ENV === "development" )
    {
      if ( !globalWithMongo._mongoClient )
      {
        mongoClient = await ( new MongoClient( uri, options ) ).connect();
        globalWithMongo._mongoClient = mongoClient;
      } else
      {
        mongoClient = globalWithMongo._mongoClient;
      }
    } else
    {
      mongoClient = await ( new MongoClient( uri, options ) ).connect();
    }

    database = await mongoClient!.db( process.env.NEXT_ATLAS_DATABASE );

    return { mongoClient, database };
  } catch ( e )
  {
    console.error( e );
  }
}