const express = require('express');
const router = express.Router();

const requests = require('./requests.js').requests;

const COLLECTION_NAME = 'hamsters';

router.get('/', async (req, res) => {
	const hamsters = await requests.getRequest(COLLECTION_NAME);

	hamsters.sort(function (a, b) {
		return a.wins - b.wins;
	});
	hamsters.reverse();
	const winners = hamsters.slice(0, 5);
	
	res.status(200).send(winners);
});

module.exports = router;