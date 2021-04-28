const express = require('express');
const router = express.Router();

const requests = require('./requests.js').requests;

router.get('/', (req, res) => {
	res.status(400).send("Du måste ange ett hamster id");
});

router.get('/:id', async (req, res) => {

	const id = req.params.id;
	const hamster = await requests.getWithId('hamsters', id);
	if (hamster === 500) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	if (hamster === 404) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}

	const matches = await requests.getRequest('matches');
	if (!matches) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}

	let defeatedHamsters = [];
	matches.forEach(match => {
		if (hamster.firestoreId === match.winnerId) {
			defeatedHamsters.push(match.loserId);
		}
	});

	if (defeatedHamsters.length === 0) {
		res.status(200).send("Hamstern har inte vunnit någon match");
		return;
	}

	res.status(200).send(defeatedHamsters);
});

module.exports = router;