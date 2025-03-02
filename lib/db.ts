import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MongoDB URI in the .env file");
}

let cached = globalThis.mongoose;

if (!cached) {
    cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then(() => mongoose.connection)
            .catch((err) => {
                console.error('MongoDB connection error:', err);
                throw new Error('Failed to connect to MongoDB');
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
