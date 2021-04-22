const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

// async function getWinners() {
// 	const snapshot = await db.collection('winners').get();
// 	let winners = [];
// 	snapshot.forEach(docRef => {
// 		const data = docRef.data();
// 		data.firestoreId = docRef.id;
// 		winners.push(data);
// 	});
// 	return winners;
// }

router.get('/', async (req, res) => {
	// const winners = await getWinners();
	const winners = "DET HÄR ÄR WINNERS";
	res.status(200).send(winners);
});

module.exports = router;