import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function connectToDatabase() {
    try {
        // Connect to MongoDB
        await client.connect();

        // Get the database instance
        const db = client.db();
        
        // Return both the database and client
        return { db, client };
    } catch (error) {
        // Log and throw any errors
        console.error('Error connecting to database:', error);
        throw error;
    }
}