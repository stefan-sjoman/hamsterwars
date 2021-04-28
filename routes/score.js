const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const requests = require('./requests.js').requests;

router.get('/', (req, res) => {
	res.status(400).send("Du måste ange ID på hamstrarna");
});

router.get('/:challenger', (req, res) => {
	res.status(400).send("Du måste ange ett ID på motståndaren");
});

router.get('/:challenger/:defender', async (req, res) => {
	let challenger = req.params.challenger;
	let challengerWins = 0;
	let defender = req.params.defender;
	let defenderWins = 0;

	let correctChallenger = await requests.getWithId('hamsters', challenger);
	let correctDefender = await requests.getWithId('hamsters', defender);

	if (correctChallenger === 500 || correctDefender === 500) {
		res.status(500).send("Fel med databasen");
		return;
	}
	if (correctChallenger === 404 || correctDefender === 404) {
		res.status(404).send("Kontrollera dina hamster id");
		return;
	}

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