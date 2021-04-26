const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

async function getMatches() {
	let matches = [];
	try {
		const snapshot = await db.collection('matches').get();
		snapshot.forEach(docRef => {
			const data = docRef.data();
			data.firestoreId = docRef.id;
			matches.push(data);
		});
	} catch (error) {
		return false;
	}
	return matches;
}

router.get('/', async (req, res) => {
	res.status(400).send("Du måste ange ett ID på en hamster");
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const matches = await getMatches();
	let matchesWon = [];

	matches.forEach(match => {
		if (id === match.winnerId) {
			matchesWon.push(match);
		}
	});
	
	if (matchesWon.length === 0){
		res.status(404).send(`Hamstern ${id} har inte vunnit några matcher.`);
		return;
	}
 	res.status(200).send(matchesWon);
});

module.exports = router;