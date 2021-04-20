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
		res.status(400).send("Något är fel med hamsterobjektet.");
		return;
	}

	const docRef = await db.collection('hamsters').add(object);
	res.send(docRef.id);
});

router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	if (!object || !id) {
		res.status(400).send("Något gick fel med id eller ändringen av hamstern.");
		return;
	}

	const docRef = db.collection('hamsters').doc(id);
	await docRef.set(object, {merge: true});
	res.status(200).send("Hamstern är ändrad! :D");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	if (!id) {
		res.status(400).send("Du måste ange ett id");
	}

	await db.collection('hamsters').doc(id).delete();
	res.status(200).send("Hamstern är borttagen.");
})

function isHamsterObject(object) {
	if (!object) {
		return false;
	}
	return true;
}

module.exports = router;