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

function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}


function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.player.name; });
    return totalVotes;
}


function totalTeams(array) {
    var total = 0;
    for ( var i = 0; i < array.length; i++)
        total += 1;
    return 'Total number of teams in the Database is => ' + total;
}


//  --------------------- get methods --------------------- //
router.getDisplay = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
        if (err)
            res.send({message : 'Failed to process command. Try again pls.'});

        else
        res.send(JSON.stringify(players,null,5));

    });
}

router.getPlayers = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
        if (err)
            res.send({message : 'Failed to process command. Try again pls.'});

        else
            res.send({message : totalTeams(players)});

    });
}

function totalTeams(array) {
    var total = 0;
    for ( var i = 0; i < array.length; i++)
        total += 1;
    return 'Total number of teams in the Database is => ' + total;
}

router.getNumberOfTeams = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
    if (err)
        res.send({message : 'Failed to count players'});
    else
        res.json({ total : totalTeams(players)});
    });
}

router.getTeam = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Data.find({ "_id" : req.params.id },function(err, team) {
        if (err)
            res.json({ message: 'Donation NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(team,null,5));
    });
}

function pl(array) {
    let p = array['player'];
    for ( var i = 0; i < p.length; i++)

    return 'Total number of teams in the Database is => ' + p[i].name + p[i].seasons_played;
}

router.getPlayersOnTeam = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Data.find({ "_id" : req.params.id },function(err, players) {
        if (err)
            res.json({ message: 'Team not found!', errmsg : err } );
        else
            res.json({ p : pl(players)})
    });
}

// --------------------- put methods --------------------- //
router.putChamps = (req, res) => {

    Data.findById(req.params.id, function(err,team) {
        if (err)
            res.json({ message: 'Team NOT Found!', errmsg : err } );
        else {
            team.champs += 1;
            team.save(function (err) {
                if (err)
                    res.json({ message: 'Team Championship status NOT UpVoted!', errmsg : err } );
                else

                    res.send(JSON.stringify(team,null,5));
            });
        }
    });
}

router.putSeason = (req, res) => {

    Data.find(req.params.id, function(err,team) {
        if (err) {
            res.json({message: 'Team NOT Found!', errmsg: err});
        }
        else {
            team.player.seasons_played += 1;
            team.save(function (err) {
                if (err)
                    res.json({message: 'Team Championship status NOT UpVoted!', errmsg: err});
                else

                    res.send(JSON.stringify(team, null, 5));
            });
        }
    });
}


// --------------------- delete methods --------------------- //
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




router.addPlayer = (req, res) => {
    Data.findById(req.params.id, function (err, player) {
        if (err)
            res.json({message: 'Item NOT Found!', errmsg: err});
        else {
            player['player'].push({name : req.params.name, seasons_played: req.params.seasons_played});
            player.save(function (err) {
                if (err)
                    res.json({message: 'Player NOT Added!', errmsg: err});
                else
                    res.json({message: 'Player Successfully Added!', data: donation});
            });
        }
    });
}



module.exports = router;
