const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

async function getHamsters() {
	const snapshot = await db.collection('hamsters').get();
	let hamsters = [];
	snapshot.forEach(docRef => {
		const data = docRef.data();
		data.firestoreId = docRef.id; // to save the firestore id
		hamsters.push(data);
	});
	return hamsters;
}

async function checkId(inputId) {
	const hamsters = await getHamsters();

	return hamsters.find(hamster => hamster.firestoreId === inputId);
}

async function checkObject(inputObject) {
	return Object.keys(inputObject).length !== 0;
}

router.get('/', async (req, res) => {
	const hamsters = await getHamsters();

	res.status(200).send(hamsters);
});

router.get('/random', async (req, res) => {
	const hamsters = await getHamsters();
	let randomIndex = Math.floor(Math.random() * (hamsters.length -1));

	res.status(200).send(hamsters[randomIndex]);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const isCorrectId = await checkId(id);

	if (!isCorrectId) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}
	const docRef = await db.collection('hamsters').doc(id).get();
	const hamster = docRef.data();
	hamster.firestoreId = docRef.id;

	res.status(200).send(hamster);
});

router.post('/', async (req, res) => {
	const object = req.body;
	const isObject = checkObject(object);
	if (!isObject) {
		res.status(400).send("Kontrollera hamsterobjektet du försöker lägga till");
		return;
	}
	const docRef = await db.collection('hamsters').add(object);
	const firestoreId = {
		id: docRef.id
	};
	res.status(200).send(firestoreId);
});

router.post('/postmany', async (req, res) => {
	const array = req.body;
	await array.forEach(hamster => {
	db.collection('hamsters').add(hamster);
	});

	res.status(200).send("Dina hamstrar är tillagda");
});

router.put('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ändra en hamster");
});

router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;
	const isCorrectId = await checkId(id);
	if (!isCorrectId) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}
	const isObject = checkObject(object);
	if (!isObject) {
		res.status(400).send("Kontrollera hamsterobjektet du försöker ändra");
		return;
	}
	const docRef = db.collection('hamsters').doc(id);
	await docRef.set(object, {merge: true});

	res.status(200).send("Hamstern är ändrad");
});

router.delete('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ta bort en hamster");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const isCorrectId = await checkId(id);
	if (!isCorrectId) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}
	await db.collection('hamsters').doc(id).delete();

	res.status(200).send("Hamstern är borttagen");
});

module.exports = router;