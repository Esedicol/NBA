let nba = require('../models/nba');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(nba,null,5));
}

module.exports = router;
