let Data = require('../models/data');
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

function sameTeamTotal(array, t) {

    var total = 0;
    for (var i = 0 ; i < array.length ; i++) {
        let x = array[i].team;
        if(t == x) {
            total += 1;
            res.send({message : 'Failed to process command. Try again pls.'});
        }
        else {
            res.send({message : 'Function failed'});
        }
    }

}

// --------------------- get --------------------- //
function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}


function totalTeams(array) {
    var total = 0;
    for ( var i = 0; i < array.length; i++)
        total += 1;
    return 'Total number of teams in the Database is => ' + total;
}


//  --------------------- methods --------------------- //
router.display = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
        if (err)
            res.send({message : 'Failed to process command. Try again pls.'});

        else
        res.send(JSON.stringify(players,null,5));

    });
}


router.numberOfTeams = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
    if (err)
        res.send({message : 'Failed to count players'});
    else
        res.send(function(Data) {
            for (var i = 0; i < Data.player[i]; i++) {
                x += myObj.cars[i];
            }
        });
    });
}


router.getATeam = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Data.find({ "_id" : req.params.id },function(err, players) {
        if (err)
            res.json({ message: 'Team not found!', errmsg : err } );
        else
            res.send(JSON.stringify(players,null,5));
    });
}

/*
router.numberOfPlayerInATeam = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Data.find({ "_id" : req.params.id },function(err, players) {
        if (err)
            res.json({ message: 'Team not found!', errmsg : err } );
        else
            res.send(JSON.stringify(players,null,5));
    });
}
*/




router.addPlayer = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var player = new Data();

    player.name = req.body.name;
    player.seasons_played = req.body.seasons_played;

    player.save(function(err) {
        if (err)
            res.json({ message: 'Donation NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Donation Successfully Added!', data : player });
    });
}

router.addTeam = (req, res) => {

}



router.incrementUpvotes = (req, res) => {
    // Find the relevant donation based on params id passed in
    // Add 1 to upvotes property of the selected donation based on its id
    var donation = getByValue(Data,req.params.id);

    if (donation != null) {
        donation.upvotes += 1;
        res.json({status : 200, message : 'UpVote Successful' , donation : donation });
    }
    else
        res.send('Donation NOT Found - UpVote NOT Successful!!');

}

router.deleteTeam = (req, res) => {

    Data.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Team NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Team Successfully Deleted!'});
    });
}

router.findTotalVotes = (req, res) => {

    let votes = getTotalVotes(Data);
    res.json({totalvotes : votes});
}

module.exports = router;
