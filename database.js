const admin = require('firebase-admin');
//const privateKey = require('./private_key.json');
const privateKey = {test:"Harshada"};

admin.initializeApp({
	credential: admin.credential.cert(privateKey)
});

function getDatabase() {
	return admin.firestore();
}

module.exports = getDatabase;