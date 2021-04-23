const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

async function getHamsters() {
	let hamsters = [];
	try {
		const snapshot = await db.collection('hamsters').get();
		snapshot.forEach(docRef => {
			const data = docRef.data();
			data.firestoreId = docRef.id; // for easy access of id
			hamsters.push(data);
		});
	} catch (error) {
		return false;
	}
	return hamsters;
}

async function checkAndGet(inputId) {
	const hamsters = await getHamsters();
	if (!hamsters) {
		return 500; //Internal Server Error.
	}
	const hamster = hamsters.find(hamsterItem => hamsterItem.firestoreId === inputId);
	if (!hamster) {
		return 404; //Id does not exist.
	}
	return hamster;
}

function checkObject(inputObject) {
	return Object.keys(inputObject).length === 0;
}

router.get('/', async (req, res) => {
	const hamsters = await getHamsters();
	if (!hamsters) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	res.status(200).send(hamsters);
});

router.get('/random', async (req, res) => {
	const hamsters = await getHamsters();
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
	const hamster = await checkAndGet(id);
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
	const isObject = checkObject(object);
	if (isObject) {
		res.status(400).send("Kontrollera hamsterobjektet du försöker lägga till");
		return;
	}
	try {
		const docRef = await db.collection('hamsters').add(object);
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
			db.collection('hamsters').add(hamster);
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

	const isObject = checkObject(object);
	if (isObject) {
		res.status(400).send("Kontrollera hamsterobjektet du försöker ändra");
		return;
	}
	const isCorrectId = await checkAndGet(id);
	if (isCorrectId === 500) {
		console.log(error);
		res.status(500).send("Fel med databasen");
		return;
	}
	if (isCorrectId === 404) {
		res.status(404).send("Kontrollera ditt hamster id");
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
	const isCorrectId = await checkAndGet(id);
	if (isCorrectId === 404) {
		res.status(404).send("Kontrollera ditt hamster id");
		return;
	}
	try {
		await db.collection('hamsters').doc(id).delete();
		res.status(200).send("Hamstern är borttagen");
	} catch (error) {
		console.log(error);
		res.status(500).send("Fel med databasen");
	}
});

module.exports = router;