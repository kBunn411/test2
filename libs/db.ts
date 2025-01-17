import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error("Please define the MONGODB_URL environment variable");
}

let cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connect = async () => {
    if (cached.conn) return cached.conn;

    cached.promise = mongoose.connect(MONGODB_URL!, {
        dbName: "chef",
        bufferCommands: false,
        connectTimeoutMS: 30000,
    });
    cached.conn = await cached.promise;
    return cached.conn;
};




{/*
import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

console.log("MongoDB URL:", MONGODB_URL);

interface MongooseConn{
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose

if (!cached){
    cached = (global as any).mongoose = {
        conn: null,
        promise: null

    };
}

export const connect = async () => {
    if (cached.conn) return cached.conn;

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL,{
        dbName: 'chef',
        bufferCommands: false,
        connectTimeoutMS: 30000
    });

    cached.conn = await cached.promise;
    return cached.conn;
}

*/}