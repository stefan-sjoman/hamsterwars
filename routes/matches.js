const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

async function getMatches() {
	const snapshot = await db.collection('matches').get();
	let matches = [];
	snapshot.forEach(docRef => {
		const data = docRef.data();
		data.firestoreId = docRef.id;
		matches.push(data);
	});
	return matches;
}

router.get('/', async (req, res) => {
	const matches = await getMatches();

	res.status(200).send(matches);
});

module.exports = router;