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

module.exports = router;