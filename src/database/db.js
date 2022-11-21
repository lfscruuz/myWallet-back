import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  console.log("MongoDB Conectado")
} catch (error) {
  console.log(error);
}

const db = mongoClient.db("myWallet");
export const usersCollection = db.collection("users");
export const registryCollection = db.collection("registry");
export const sessionsCollection = db.collection("sessions");
