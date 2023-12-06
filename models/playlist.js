// Import mongoose
const mongoose = require('mongoose');

// Create schema definition object using mapping notation
const playlistsSchemaDefinition = {
    name: {
        type: String,
        required: true
    },
};

var playlistsSchema = new mongoose.Schema(playlistsSchemaDefinition);
module.exports = mongoose.model('Playlist', playlistsSchema);