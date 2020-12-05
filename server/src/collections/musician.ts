import { model, Schema, Document } from "mongoose";

interface IAlbum extends Document {
    name: string;
}

const AlbumSchema = new Schema<IAlbum>({
    name: String,
});

interface IMusician extends Document {
    name: string;
    albums: string[];
    members: string[];
}

const MusicianSchema = new Schema<IMusician>({
    name: {type: String, required: true },
    albums: [AlbumSchema],
    members: [String],
})

export const Musician = model<IMusician>('Musician', MusicianSchema);