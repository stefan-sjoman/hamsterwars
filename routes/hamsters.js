const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const checkInputs = require('./checkInput.js').checkInputs;
const requests = require('./requests.js').requests;

const COLLECTION_NAME = 'hamsters';
const hamsterKeys = [
	'age',
	'defeats',
	'favFood',
	'games',
	'imgName',
	'loves',
	'name',
	'wins'
];

function checkNewHamster(object) {
return checkInputs.checkNewObject(object, hamsterKeys);
}

router.get('/', async (req, res) => {
	const hamsters = await requests.getRequest(COLLECTION_NAME);
	if (!hamsters) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	res.status(200).send(hamsters);
});

router.get('/random', async (req, res) => {
	const hamsters = await requests.getRequest(COLLECTION_NAME);
	if (!hamsters) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	let randomIndex = Math.floor(Math.random() * (hamsters.length -1));
	res.status(200).send(hamsters[randomIndex]);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const hamster = await requests.getWithId(COLLECTION_NAME, id);
	if (hamster === 500) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	if (hamster === 404) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}
	res.status(200).send(hamster);
});

router.post('/', async (req, res) => {
	const object = req.body;
	const isCorrect = checkNewHamster(object);
	if (!isCorrect) {
		res.status(400).send("Kontrollera hamsterobjektet du försöker lägga till");
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
	}
});

router.post('/postmany', async (req, res) => {
	const array = req.body;
	try {
		await array.forEach(hamster => {
			db.collection(COLLECTION_NAME).add(hamster);
		});
		res.status(200).send("Dina hamstrar är tillagda");
	} catch (error) {
		console.log(error);
		res.status(500).send("Fel med databasen");
	}
});

router.put('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ändra en hamster");
});

router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	let isObject;

	const keys = Object.keys(object);
	if (keys.length === 0) {
		return false;
	}

	let controlledKeys = [];

	hamsterKeys.forEach(hamsterKey => {
		keys.forEach(key => {
			if (key === hamsterKey) {
				controlledKeys.push(key);
			}
		})
	});
	if (controlledKeys.length === keys.length) {
		isObject = true;
	}
	else {
		isObject = false;
	}
	
	if (!isObject) {
		res.status(400).send("Kontrollera hamsterobjektet du försöker ändra");
		return
	}
	
	const isCorrectId = await requests.getWithId(COLLECTION_NAME, id);
	if (isCorrectId === 500) {
		res.status(500).send("Fel med databasen");
		return;
	}
	if (isCorrectId === 404) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}

	try {
		const docRef = db.collection(COLLECTION_NAME).doc(id);
		await docRef.set(object, {merge: true});
	} catch (error) {
		res.status(500).send("Fel med databasen");
		return;
	}

	res.status(200).send("Hamstern är ändrad");
});

router.delete('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ta bort en hamster");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const isCorrectId = await requests.getWithId(COLLECTION_NAME, id);
	if (isCorrectId === 404) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}
	try {
		await db.collection(COLLECTION_NAME).doc(id).delete();
		res.status(200).send("Hamstern är borttagen");
	} catch (error) {
		console.log(error);
		res.status(500).send("Fel med databasen");
	}
});

module.exports = router;