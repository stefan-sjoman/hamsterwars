console.log("1");

// import packages & server config
const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;
console.log("2");
const cors = require('cors');
const path = require('path');
console.log("3");
const hamsters = require('./routes/hamsters.js');
const matches = require('./routes/matches.js');
const winners = require('./routes/winners.js');
const losers = require('./routes/losers.js');
const matchWinners = require('./routes/matchWinners.js');
console.log("4");
// middleware
app.use(cors());
app.use(express.json());
console.log("5");
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.params);
	next();
});
console.log("6");
app.use('/', express.static(path.join(__dirname, 'frontend')));
app.use('/img', express.static(path.join(__dirname, 'img')));
console.log("7");
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
