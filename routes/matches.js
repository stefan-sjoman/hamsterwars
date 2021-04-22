const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

async function getMatches() {
	let snapshot = null;
	let matches = [];
	try {
		snapshot = await db.collection('matches').get();
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

async function checkAndGet(inputId) {
	const matches = await getMatches();
	if (!matches) {
		return 500; //Internal Server Error.
	}
	const match = matches.find(matchItem => matchItem.firestoreId === inputId);
	if (!match) {
		return 404; //Id does not exist.
	}
	return match;
}

async function checkObject(inputObject) {
	return Object.keys(inputObject).length !== 0;
	//KONTROLLERA ALLA KEYS!!!!
}

router.get('/', async (req, res) => {
	const matches = await getMatches();
	if (!matches) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}

	res.status(200).send(matches);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const match = await checkAndGet(id);
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
	const isObject = checkObject(object);
	if (!isObject) {
		res.status(400).send("Kontrollera matchobjektet du försöker lägga till");
		return;
	}
	try {
		const docRef = await db.collection('matches').add(object);
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
	const isCorrectId = await checkAndGet(id);
	if (isCorrectId === 404) {
		res.status(404).send("Kontrollera ditt match id");
		return;
	}
	try {
		await db.collection('matches').doc(id).delete();
		res.status(200).send("Matchen är borttagen");
	} catch (error) {
		console.log(error);
		res.status(500).send("Fel med databasen");
	}
});

module.exports = router;