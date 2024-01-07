import mongoose from 'mongoose'
const Schema = mongoose.Schema

const playerSchema = new Schema({
    name: String,
    category: [String],
    subCategory: [String],
    club: String,
    infoEnglish: String,
    infoNorwegian: String,
    images: [String]
})

let Player = mongoose.model('Player', playerSchema)

export default Player