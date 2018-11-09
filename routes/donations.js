let Data = require('../models/data');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// --------------------- connect to mlab --------------------- //
var mongodbUri = 'mongodb://esedicol:20072377jp@ds139883.mlab.com:39883/nba'
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


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

router.getNumberOfTeams = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
        if (err)
            res.send({message : 'Failed to count players'});
        else
            res.send('Total number of teams in the Database is => ' + players.length);

    });
}

router.getTeam = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Data.find({ "_id" : req.params.id },function(err, team) {
        if (err)
            res.json({ message: 'Team NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(team,null,5));
    });
}

function getPlayer(array) {
    var data = [];
    for ( var i = 0; i < array.length; i++)
    {
        for ( var j = 0; j < array.length; j++) {
            data.push(array[i].player[j]).toString();
        }
    }
    return data;
}


router.getAllPlayers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Data.find(function(err, players) {
        if (err)
            res.send({message : 'Failed to get players'});
        else
            res.send(JSON.stringify(getPlayer(players),null,5));
    });
}


function getRev(array) {
    var data = [];
    for ( var i = 0; i < array.length; i++)
    {
        data.push(array[i].revenue).toString();
    }
    return data;
}

router.getRevenue = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Data.find({ "_id" : req.params.id },function(err, team) {
        if (err)
            res.json({ message: 'Revenue NOT Found!', errmsg : err } );
        else
            res.json('The Revenue for ' + req.params.id + ' is =>' + ' ' + getRev(team) );

    });
}

// --------------------- put methods --------------------- //
router.putChampions = (req, res) => {
    Data.findById(req.params.id, function(err,team) {
        if (err)
            res.json({ message: 'Well Done on winning!', errmsg : err } );
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

router.putRev = (req, res) => {
    Data.findById(req.params.id, function(err,team) {
        if (err)
            res.json({ message: 'Failed to up Team Revenue', errmsg : err } );
        else {
            team.revenue *= 2;
            team.save(function (err) {
                if (err)
                    res.json({ message: 'Failed to increase Revenue!', errmsg : err } );
                else

                    res.send(JSON.stringify(team,null,5));
            });
        }
    });
}

router.putSeasonsPlayed = (req, res) => {
    Data.findById(req.params.id, function(err,team) {
        if (err) {
            res.json({message: 'Failed!', errmsg: err});
        }
        else {
            for(var i = 0; i < team.player.length; i++)
                    team.player[i].seasons_played += 1;
                    team.save(function (err) {
                        if (err)
                            res.json({message: 'Failed!', errmsg: err});
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

function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}
router.deletePlayer = (req, res) => {
    Data.findById(req.params.id, function(err,team) {
        if (err) {
            res.json({message: 'ERROR!', errmsg: err});
        }
        else {
            remove(team,team.player[0]);
            team.save(function (err) {
                if (err)
                    res.json({message: 'Team Championship status NOT UpVoted!', errmsg: err});
                else

                    res.send(JSON.stringify(team, null, 5));
            });
        }
    });
}

// --------------------- post methods --------------------- //

router.addTeam = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var data = new Data();

    data.team = req.body.team;
    data.player = [];
    data.champs = req.body.champs;
    data.revenue = req.body.revenue;

    data.save(function(err) {
        if (err)
            res.json({ message: 'New Team NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Team Successfully Added!', data: donation });
    });
}


router.addPlayer = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Data.findById(req.params.id, function(err,team) {
        if (err)
            res.json({ message: 'ID NOT Found!', errmsg : err } );
        else
        team.player = team.player.push({"name": req.body.name, "seasons_played": req.body.seasons_played});

        team.save(function(err) {
            if (err)
                res.send({ message: 'Failed to add new Player!', errmsg : err } );
            else
                res.json({ message: 'New Player Successfully Added!', data: data });
        });
    });
}


module.exports = router;
