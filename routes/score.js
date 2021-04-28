const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const requests = require('./requests.js').requests;

router.get('/', async (req, res) => {
	res.status(400).send("Du måste ange ID på hamstrarna");
});

router.get('/:challenger', async (req, res) => {
	res.status(400).send("Du måste ange ett ID på motståndaren");
});

router.get('/:challenger/:defender', async (req, res) => {
	let challenger = req.params.challenger;
	let challengerWins = 0;
	let defender = req.params.defender;
	let defenderWins = 0;

	const matches = await requests.getRequest('matches');
	if (!matches) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}

	matches.forEach(match => {
		if (challenger === match.winnerId) {
			if (defender === match.loserId) {
				challengerWins += 1;
			}
		}
		if (defender === match.winnerId) {
			if (challenger === match.loserId) {
				defenderWins += 1;
			}
		}
	});

	res.status(200).send({ challengerWins, defenderWins });
});

module.exports = router;