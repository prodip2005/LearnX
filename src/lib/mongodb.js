import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = "learnX"; 
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}


export async function getDb() {
    const conn = await clientPromise;
    return conn.db(dbName);
}


export async function getCollection(collectionName) {
    const db = await getDb();
    return db.collection(collectionName);
}

export default clientPromise;