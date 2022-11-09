import WorkoutModel from './model/workout-model.js'
import mongoose from 'mongoose';
import 'dotenv/config';
import {createClient} from 'redis';

const client = createClient({
    url: process.env.REDIS_URI
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => { console.log('Connected to redis') });

export async function getAllWorkout(req, res) {
    try {
        // Tries to search the cache first
        const cache = await client.get('all-workout');

        if (cache) {
            const cachedWorkouts = JSON.parse(cache);
            return res.status(200).json({message:"Cache hit! Sending the data over from the redis cache", data: cachedWorkouts});
        }

        // If no cache was found, it proceeds to search the database and store in cache
        const dbWorkouts = await WorkoutModel.find();
        await client.set('all-workout', JSON.stringify(dbWorkouts));
        return res.status(200).json({message: `No cache was found, sending data over from database and caching the data for future use`, data: dbWorkouts});

    } catch (err) {
        console.log(`Error: ${err}`);

        return res.status(500).json({message: 'Internal server error when retrieving all workout!'})
    }
}

export async function deleteCache(req, res) {
    try {
        client.del('all-workout');
        return res.status(200).send("Redis cache deleted");
    } catch(err) {
        return res.status(500).send(`Error deleteting cache: ${err}`);
    }
}

