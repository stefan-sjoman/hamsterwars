const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const checkInputs = require('./checkInput.js').checkInputs;
const requests = require('./requests.js').requests;

const COLLECTION_NAME = 'matches';

function checkNewMatch(object) {
		const matchKeys = [
		'loserId',
		'winnerId'
	];
	return checkInputs.checkNewObject(object, matchKeys);
}

router.get('/', async (req, res) => {
	const matches = await requests.getRequest(COLLECTION_NAME);
	if (!matches) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}

	res.status(200).send(matches);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const match = await requests.getWithId(COLLECTION_NAME, id);
	if (match === 500) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	if (match === 404) {
		res.status(404).send("Kontrollera ditt match id");
		return;
	}
	res.status(200).send(match);
});

router.post('/', async (req, res) => {
	const object = req.body;
	const isObject = checkNewMatch(object);
	if (!isObject) {
		res.status(400).send("Kontrollera matchobjektet du försöker lägga till");
		return;
	}
	try {
		const docRef = await db.collection(COLLECTION_NAME).add(object);
		const firestoreId = {
			id: docRef.id
		};
		res.status(200).send(firestoreId);
	} catch (error) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
});

router.delete('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ta bort en match");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const isCorrectId = await requests.getWithId(COLLECTION_NAME, id);
	if (isCorrectId === 404) {
		res.status(404).send("Kontrollera ditt match id");
		return;
	}
	try {
		await db.collection(COLLECTION_NAME).doc(id).delete();
		res.status(200).send("Matchen är borttagen");
	} catch (error) {
		console.log(error);
		res.status(500).send("Fel med databasen");
	}
});

module.exports = router;