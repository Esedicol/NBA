let mongoose = require('mongoose');


let NBASchema = new mongoose.Schema(
    {
        team : String,
        player : [ {name : String, seasons_played : Number} ],
        champs: Number
    },

    { collection: 'nba' }
    );

module.exports = mongoose.model('NBA', NBASchema);


