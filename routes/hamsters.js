const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

router.get('/', async (req, res) => {
	const snapshot = await db.collection('hamsters').get();

	let hamsters = [];
	snapshot.forEach(docRef => {
		const data = docRef.data();
		hamsters.push(data);
	});
	res.send(hamsters);
});

router.get('/random', async (req, res) => {
	const snapshot = await db.collection('hamsters').get();

	let hamsters = [];
	snapshot.forEach(docRef => {
		const data = docRef.data();
		data.firestoreId = docRef.id; // to access the firestore id
		hamsters.push(data);
	});

	let randomIndex = Math.floor(Math.random() * (hamsters.length -1));
	res.send(hamsters[randomIndex]);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const docRef = await db.collection('hamsters').doc(id).get();

	if (!docRef.exists) {
		res.status(404).send("Ingen hamster med det id:t finns.");
		return;
	}

	const hamster = docRef.data();

	res.send(hamster);
});

router.post('/', async (req, res) => {
	const object = req.body;

	if (!isHamsterObject(object)) {
		res.status(400).send("Något är fel med hamsterobjektet");
		return;
	}

	const docRef = await db.collection('hamsters').add(object);
	res.send(docRef.id);
});

router.post('/postmany', async (req, res) => {
	const array = req.body;
	
	await array.forEach(hamster => {
	db.collection('hamsters').add(hamster);
	});

	res.send("Dina hamstrar är tillagda");
});

router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	if (!object || !id) {
		res.status(400).send("Något gick fel med id eller ändringen av hamstern");
		return;
	}

	const docRef = db.collection('hamsters').doc(id);
	await docRef.set(object, {merge: true});
	res.status(200).send("Hamstern är ändrad");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	if (!id) {
		res.status(400).send("Du måste ange ett id");
	}

	await db.collection('hamsters').doc(id).delete();
	res.status(200).send("Hamstern är borttagen");
})

function isHamsterObject(object) {
	if (!object) {
		return false;
	}
	return true;
}

module.exports = router;