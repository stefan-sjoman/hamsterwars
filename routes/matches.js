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

async function checkId(inputId) {
	const matches = await getMatches();

	return matches.find(match => match.firestoreId === inputId);
}

async function checkObject(inputObject) {
	return Object.keys(inputObject).length !== 0;
}

router.get('/', async (req, res) => {
	const matches = await getMatches();

	res.status(200).send(matches);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const isCorrectId = await checkId(id);

	if (!isCorrectId) {
		res.status(404).send("Kontrollera ditt match id");
		return;
	}
	const docRef = await db.collection('matches').doc(id).get();
	const match = docRef.data();
	match.firestoreId = docRef.id;

	res.status(200).send(match);
});

router.post('/', async (req, res) => {
	const object = req.body;
	const isObject = checkObject(object);
	if (!isObject) {
		res.status(400).send("Kontrollera matchobjektet du försöker lägga till");
		return;
	}
	const docRef = await db.collection('matches').add(object);

	res.status(200).send(`Du har har lagt till en ny match med id: ${docRef.id}`);
});

router.delete('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ta bort en match");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const isCorrectId = await checkId(id);
	if (!isCorrectId) {
		res.status(404).send("Kontrollera ditt match id");
		return;
	}
	await db.collection('matches').doc(id).delete();

	res.status(200).send("Matchen är borttagen");
});

module.exports = router;