let mongoose = require('mongoose');


let NBASchema = new mongoose.Schema(
    {
        name : String,
        team : String,
        season_played : Number,
        champs: Number
    },

    { collection: 'nba' });

module.exports = mongoose.model('NBA', NBASchema);


