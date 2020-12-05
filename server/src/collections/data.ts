import { model, Schema, Document } from "mongoose";
import {TripSchema} from './trip'

interface IData extends Document {
    trips: {};
  
}

const DataSchema = new Schema<IData>({
    trips: {TripSchema},

})

export const Data = model<IData>('Data', DataSchema)
