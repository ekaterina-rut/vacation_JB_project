import { connect, model } from 'mongoose';
import { User } from './collections/user';
import {Trip} from './collections/trip'
import { Data } from './collections/data'


const MONGODB_URL = "";
// const MONGODB_URL = "mongodb+srv://katya:katya123@cluster0.bfp2s.mongodb.net/inventory?retryWrites=true&w=majority";
const DB_NAME = 'vacations';


export const collections = {
   Data
}


// run this when the server is starting
export async function connectDb() {
    console.log("data base is connected")
    await connect(MONGODB_URL, {
        useUnifiedTopology: true,
        dbName: DB_NAME,
        useNewUrlParser: true
    });
}