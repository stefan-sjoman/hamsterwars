const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

// async function getMatchWinners() {
// 	const snapshot = await db.collection('matchWinners').get();
// 	let matchWinners = [];
// 	snapshot.forEach(docRef => {
// 		const data = docRef.data();
// 		data.firestoreId = docRef.id;
// 		matchWinners.push(data);
// 	});
// 	return matchWinners;
// }

router.get('/', async (req, res) => {
	// const matchWinners = await getMatchWinners();
	const matchWinners = "DET HÄR ÄR MATCHWINNERS";
	res.status(200).send(matchWinners);
});

router.get('/:id', async (req, res) => {
	// const matchWinners = await getMatchWinners();
	const matchWinners = "DET HÄR ÄR MATCHWINNERS SÖKT MED ID";
	res.status(200).send(matchWinners);
});

module.exports = router;