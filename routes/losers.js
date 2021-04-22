const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

// async function getLosers() {
// 	const snapshot = await db.collection('losers').get();
// 	let losers = [];
// 	snapshot.forEach(docRef => {
// 		const data = docRef.data();
// 		data.firestoreId = docRef.id;
// 		losers.push(data);
// 	});
// 	return losers;
// }

router.get('/', async (req, res) => {
	// const losers = await getLosers();
	const losers = "DET HÄR ÄR LOSERS";
	res.status(200).send(losers);
});

module.exports = router;