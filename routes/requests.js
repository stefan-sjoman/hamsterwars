const dbFunction = require('../database.js');
const db = dbFunction();

async function getRequest(COLLECTION_NAME) {
	let response = [];
	try {
		const snapshot = await db.collection(COLLECTION_NAME).get();
		snapshot.forEach(docRef => {
			const data = docRef.data();
			data.firestoreId = docRef.id;
			response.push(data);
		});		
	} catch (error) {
		return false;
	}
	return response;
}

async function getWithId(COLLECTION_NAME, id) {
	const response = await getRequest(COLLECTION_NAME);
	if (!response) {
		return 500;
	}
	const foundItem = response.find(item => item.firestoreId === id);
	if (!foundItem) {
		return 404;
	}
	return foundItem;
}

module.exports.requests = { getRequest, getWithId }