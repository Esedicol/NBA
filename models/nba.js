/*
let mongoose = require('mongoose');


let NBASchema = new mongoose.Schema({
        name : String,
        team : String,
        season_played : {type: Number, default: 0 },
        champs: {type : Number, default: 0 }

    },
    { collection: 'nba' });

module.exports = mongoose.model('Donation', NBASchema);
*/

const donations = [
    {id: 1000000, paymenttype: 'PayPal', amount: 1600, upvotes: 1},
    {id: 1000001, paymenttype: 'Direct', amount: 1100, upvotes: 2},
    {id: 1000002, paymenttype: 'Visa', amount: 1000, upvotes: 1}
];

module.exports = donations;
