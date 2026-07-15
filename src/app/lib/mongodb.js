import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, Next.js reloads files often, which would create
  // a new connection every time without this. So we stash the
  // connection on the global object to reuse it across reloads.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, just create one client normally.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getReviewsCollection() {
  const client = await clientPromise;
  const db = client.db("campusRAG");
  return db.collection("reviews");
}