import { model, Schema, Document, SchemaTypes } from "mongoose";



export interface ITrip extends Document {
    name: string;
    contry: string;
    description: string;
    img: string,
    start_date: Date,
    end_date: Date,
    price: number,
    followers: number

}

// export interface ITrips extends Document {
//     trips: {}
// }


// 3.	חופשה:מזהה,תיאור, יעד, תמונה, תאריכים )מתאריך עד לתאריך( מחיר, כמות העוקבים. 

export const TripSchema = new Schema<ITrip>({
    name: { type: String, required: true },
    contry: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    price: { type: Number, required: true },
    followers: { type: Number, required: true },

})





// export const TripsScema = new Schema<ITrips>({

//     trips: { type: SchemaTypes.ObjectId, ref: 'trips' },

// })



export const Trip = model<ITrip>('Trip', TripSchema)






