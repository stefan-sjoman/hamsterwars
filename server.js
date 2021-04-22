// import packages & server config
const express = require('express');
const app = express();
const PORT = 1337;

const cors = require('cors');
const path = require('path');

const hamsters = require('./routes/hamsters.js');
const matches = require('./routes/matches.js');
const winners = require('./routes/winners.js');
const losers = require('./routes/losers.js');
const matchWinners = require('./routes/matchWinners.js');

// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.params);
	next();
});

// routes
app.use('/hamsters', hamsters);
app.use('/matches', matches);
app.use('/winners', winners);
app.use('/losers', losers);
app.use('/matchWinners', matchWinners);

// start server
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
