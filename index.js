import express from 'express';
import cors from 'cors';
import { getAllWorkout, deleteCache } from './workout.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import WorkoutModel from './model/workout-model.js';

const PORT = process.env.PORT;
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({}))

const router = express.Router()

//Set up mongoose connection
let mongoDB = process.env.NODE_ENV === "production" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

if (process.env.NODE_ENV === "test") {
    // Use temp storage for testing
    let memdb = await MongoMemoryServer.create();
    mongoDB = memdb.getUri();
} 

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
let db = mongoose.connection;
db.on('connected', function() {
    if (!(process.env.NODE_ENV === "test")) {
        console.log('MongoDB connected successfully')
    }
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Import mock data
const data = JSON.parse(fs.readFileSync('./MOCK_DATA.json', 'utf-8'))

const importData = async () => {
  try {
    await WorkoutModel.create(data)
    console.log('data successfully imported')
  } catch (error) {
    console.log('error', error)
  }
}

WorkoutModel.count(function (err, count) {
    if (!err && count === 0) {
        importData();
    } 
});

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from workout'));
router.get('/getAllWorkout', getAllWorkout);
router.delete('/deleteCache', deleteCache);

router.get('*', (req, res) => {
    return res.status(404).json({message: 'Non-existing route'});
});

app.use('/api/workout', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(PORT, () => console.log(`workout listening on port ${PORT}`));

export { app };