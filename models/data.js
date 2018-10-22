
let mongoose = require('mongoose');


let NBASchema = new mongoose.Schema({
        name : String,
        team : String,
        season_played : {type: Number, default: 0 },
        champs: {type : Number, default: 0 }

    },
    { collection: 'nba' });

module.exports = mongoose.model('NBA', NBASchema);

/*
const data = [
    {id: 1000000, name : 'Lebron',   team: 'Cavs',       champions: 1},
    {id: 1000001, name : 'Kobe',     team: 'Lakers',     champions: 2},
    {id: 1000002, name : 'Stephen',  team: 'Warriors',   champions: 1}
];

module.exports = data;
*/
