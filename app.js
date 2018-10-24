var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const nba = require("./routes/donations");

var app = express();

// --------------------- view engine setup --------------------- //
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// --------------------- get --------------------- //
// Display everyting in database //
app.get('/nba', nba.getDisplay);

// get total number of teams //
app.get('/nba/total', nba.getNumberOfTeams);

// display chosen team //
app.get('/nba/:id', nba.getTeam);

// get all players on a team //
app.get('/players', nba.getAllPlayers);

// get the revenue of a item //
app.get('/nba/:id/rev', nba.getRevenue);




// --------------------- post --------------------- //
app.post('/nba/team', nba.addTeam);

app.post('/nba/player', nba.addPlayer);



// --------------------- put --------------------- //
app.put('/nba/:id/win', nba.putChamps);
app.put('/nba/:id/season', nba.putSeason);


// --------------------- delete --------------------- //
app.delete('/nba/:id', nba.deleteTeam);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
