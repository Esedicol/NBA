let data = require('../models/data');
let express = require('express');
let router = express.Router();

// --------------------- connect to mongo database --------------------- //
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nba');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


// --------------------- functions --------------------- //
function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

function getTotalPlayers(array) {
    let total = array.length;
    return 'total players is :' + total;
}


//  --------------------- methods --------------------- //
router.findAllPlayers = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    data.find(function(err, players) {
        if (err)
            res.send({message : 'Failed to process command. Try again pls.'});

        else
        res.send(JSON.stringify(players,null,5));

    });
}

router.totalPlayers = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    data.find(function(err, players) {
    if (err)
        res.send({message : 'Failed to count players'});
    else
        res.send(getTotalPlayers(data));
    });
}

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var id = getByValue(data,req.params.id);

    if (id != null)
        res.send(JSON.stringify(id,null,5));
    else
        res.send('Donation NOT Found!!');

}


router.addPlayer = (req, res) => {
    //Add a new donation to our list
    var id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
    var currentSize = data.length;

    data.push({"id" : id, "paymenttype" : req.body.paymenttype, "amount" : req.body.amount, "upvotes" : 0});

    if((currentSize + 1) == data.length)
        res.json({ message: 'Donation Added Successfully!'});
    else
        res.json({ message: 'Donation NOT Added!'});
}



router.incrementUpvotes = (req, res) => {
    // Find the relevant donation based on params id passed in
    // Add 1 to upvotes property of the selected donation based on its id
    var donation = getByValue(data,req.params.id);

    if (donation != null) {
        donation.upvotes += 1;
        res.json({status : 200, message : 'UpVote Successful' , donation : donation });
    }
    else
        res.send('Donation NOT Found - UpVote NOT Successful!!');

}

router.deleteDonation = (req, res) => {
    //Delete the selected donation based on its id
    var donation = getByValue(data,req.params.id);
    var index = data.indexOf(donation);

    var currentSize = data.length;
    data.splice(index, 1);

    if((currentSize - 1) == data.length)
        res.json({ message: 'Donation Deleted!'});
    else
        res.json({ message: 'Donation NOT Deleted!'});
}

router.findTotalVotes = (req, res) => {

    let votes = getTotalVotes(data);
    res.json({totalvotes : votes});
}

module.exports = router;
