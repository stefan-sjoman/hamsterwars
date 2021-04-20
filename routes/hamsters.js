const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

router.get('/', async (req, res) => {
	const hamstersRef = db.collection('hamsters');
	const snapshot = await hamstersRef.get();

	let hamsters = [];
	snapshot.forEach(docRef => {
		const data = docRef.data();
		hamsters.push(data);
	});

	res.send(hamsters);
});

// TODO: Hämta en hamster med :id

router.post('/', async (req, res) => {
	const object = req.body;

	if (!isHamsterObject(object)) {
		res.status(400).send("Något gick fel... :(");
		return;
	}

	const docRef = await db.collection('hamsters').add(object);
	res.send(docRef.id);
});

function isHamsterObject(object) {
	if (!object) {
		return false;
	}
	return true;
}

module.exports = router;