const express = require('express');
const router = express.Router();

// const dbFunction = require('../database.js');
// const db = dbFunction();

const hamsterFunctions = require('./hamsters.js').functions;

// async function getHamsters() {
// 	let hamsters = [];
// 	try {
// 		const snapshot = await db.collection('hamsters').get();
// 		snapshot.forEach(docRef => {
// 			const data = docRef.data();
// 			data.firestoreId = docRef.id;
// 			hamsters.push(data);
// 		});
// 	} catch (error) {
// 		return false;
// 	}
// 	return hamsters;
// }

router.get('/', async (req, res) => {
	const hamsters = await hamsterFunctions.getHamsters();

	hamsters.sort(function (a, b) {
		return a.wins - b.wins;
	});
	hamsters.reverse();
	const winners = hamsters.slice(0, 5);
	
	res.status(200).send(winners);
});

module.exports = router;