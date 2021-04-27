const express = require('express');
const router = express.Router();

const hamsterFunctions = require('./hamsters.js').functions;

router.get('/', async (req, res) => {
	const hamsters = await hamsterFunctions.getHamsters();

	hamsters.sort(function (a, b) {
		return a.wins - b.wins;
	});
	const losers = hamsters.slice(0, 5);
	
	res.status(200).send(losers);
});

module.exports = router;