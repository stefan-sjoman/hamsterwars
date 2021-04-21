const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

async function getHamsters() {
	const snapshot = await db.collection('hamsters').get();
	let hamsters = [];
	snapshot.forEach(docRef => {
		const data = docRef.data();
		data.firestoreId = docRef.id; // to access the firestore id
		hamsters.push(data);
	});
	return hamsters;
}

router.get('/', async (req, res) => {
	const hamsters = await getHamsters();

	res.send(hamsters);
});

router.get('/random', async (req, res) => {
	const hamsters = await getHamsters();

	let randomIndex = Math.floor(Math.random() * (hamsters.length -1));
	res.send(hamsters[randomIndex]);
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const docRef = await db.collection('hamsters').doc(id).get();

	const hamster = docRef.data();

	res.send(hamster);
});

router.post('/', async (req, res) => {
	const object = req.body;

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

router.put('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ändra en hamster");
});

router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	const docRef = db.collection('hamsters').doc(id);
	await docRef.set(object, {merge: true});
	res.status(200).send("Hamstern är ändrad");
});

router.delete('/', (req, res) => {
	res.status(400).send("Du måste ange ett id för att ta bort en hamster");
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	await db.collection('hamsters').doc(id).delete();
	res.status(200).send("Hamstern är borttagen");
});

module.exports = router;