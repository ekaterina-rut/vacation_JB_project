import { model, Schema, Document } from "mongoose";
import { ITrip, TripSchema } from "./trip";

// export interface IUser extends Document {
//     // _id: string,
//     id: number,
//     email: string,
//     password: string,
//     first_name: string,
//     last_name: string,
//     city: string,
//     street: string,
//     admin: boolean,
//     open_bag: boolean
// }

export interface IUser extends Document {
    name: string,
    first_name: string,
    last_name: string,
    user_name: string,
    password: string,
    admin: boolean,
    followed_trips: string[]
}

const User_schema = new Schema<IUser>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    admin: Boolean,
    followed_trips: { type: [String], required: true },

})


// SCHEMA=======================================



User_schema.path('user_name').validate(async (user_name: string) => {
    const isIdExist = await User.findOne({ user_name }).exec();
    return !isIdExist
}, 'this user name is allready exist')

export const User = model<IUser>('User', User_schema);


