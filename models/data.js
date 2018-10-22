let mongoose = require('mongoose');


let NBASchema = new mongoose.Schema({
        name : String,
        team : String,
        season_played : {type: Number, default: 0 },
        champs: {type : Number, default: 0 }

    },
    { collection: 'nba' });

module.exports = mongoose.model('NBA', NBASchema);


