// Import mongoose
const mongoose = require('mongoose');

// Create schema definition object using mapping notation
const songsSchemaDefinition = {
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    singer: {
        type: String,
        required: true
    },
    playlist: {
        type: String,
        required: true
    },
    filename: {
        type: String
    },
};

var songsSchema = new mongoose.Schema(songsSchemaDefinition);
module.exports = mongoose.model('Song', songsSchema);