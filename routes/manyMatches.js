const express = require('express');
const router = express.Router();

const requests = require('./requests.js').requests;

router.get('/', async (req, res) => {
	const hamsters = await requests.getRequest('hamsters');
	if (!hamsters) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	// res.status(200).send(hamsters);
	hamsters.sort(function (a, b) {
		return a.games - b.games;
	});
	hamsters.reverse();

	let manyMatches = []
	let i = 0;
	do {
		manyMatches.push(hamsters[i].firestoreId);
		i++;
	} while (hamsters[i-1].games === hamsters[i].games)

	res.status(200).send(manyMatches);

});

module.exports = router;